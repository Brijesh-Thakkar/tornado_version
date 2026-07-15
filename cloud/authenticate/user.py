#
#
#   Model of a user
#
#
import json
import logging
from passlib.hash import sha256_crypt
from cloud.storage import storage


userdir = "users"
userdirpath = ["home",userdir]

               
class User:
    def __init__(self, user="", password="", data=None):
        if data != None:
            self.set_data(data)
            return
        data = {}
        data["email"] = user
        # salt and save the salted pw
        data["confirmed"] = True
        data["pwhash"] = sha256_crypt.hash(password)  # .encrypt() deprecated since passlib 1.7
        data["lastlogin"] = ""
        data["createdon"] = ""
        data["dongle"] = ""
        self.data = data
    def authenticate(self, password):
        result = sha256_crypt.verify(password, self.data["pwhash"])
        logging.info("authenticate: hash_prefix=%s pw_len=%d match=%s",
                     self.data["pwhash"][:20], len(password), result)
        return result        
    def set_password(self, newpassword):
        self.data["pwhash"] = sha256_crypt.hash(newpassword)
    def set_confirmed(self):
        self.data["confirmed"] = True
    def get_confirmed(self):
        return self.data["confirmed"]
    def set_data(self, data):
        self.data = json.loads(data)
    def get_data(self):
        return json.dumps(self.data)
    def get_user(self):
        return self.data["email"]
    def set_dongle(self, dongle):
        self.data["dongle"] = dongle
    def get_dongle(self):
        return self.data["dongle"]

    
def get_user_path(email):
    path = userdirpath[:]
    path.append(email)
    return path

def user_exists(email):
    #check if the user exists
    path = get_user_path(email)
    fileobj = storage.getFile(path)
    if not fileobj:
        return False
    else:
        return True

def get_user(email):
    path = get_user_path(email)
    fileobj = storage.getFile(path)
    if not fileobj:
        return None
    user = User(data=fileobj.data)
    return user

def set_user(userobj):
    path = get_user_path(userobj.get_user())
    storage.updateFile(path, userobj.get_data())
    
def create_user(email, password):
    #create the user if it does not exist
    if user_exists(email):
        logging.warning("create_user: user already exists: %s", email)
        return
    logging.info("create_user: starting for email=%s", email)
    # ensure ["home"] root dir exists before creating ["home","users"]
    if not storage.getFile(["home"]):
        logging.info("create_user: creating /home dir")
        if not storage.createDir(["home"]):
            logging.error("create_user: failed to create /home dir")
            return
    if not storage.getFile(userdirpath):
        logging.info("create_user: creating %s dir", str(userdirpath))
        if not storage.createDir(userdirpath):
            logging.error("create_user: failed to create %s dir" % str(userdirpath))
            return
    path = get_user_path(email)
    logging.info("create_user: writing user record to S3 path=%s", str(path))
    user = User(user=email, password=password)
    ok = storage.createFile(path, user.get_data())
    if not ok:
        logging.error("create_user: FAILED to write user file for %s — S3 write returned False", email)
    else:
        logging.info("create_user: user record written successfully for %s", email)    
    
def delete_user(email):
    # delete the user
    if not user_exists(email):
        return
    path = get_user_path(email)
    storage.deleteFile(path)    

def authenticate_user(email, password):
    logging.info("authenticate_user: looking up email=%s", email)
    user = get_user(email)
    if user == None:
        logging.warning("authenticate_user: user NOT FOUND for email=%s", email)
        return False
    logging.info("authenticate_user: user found, confirmed=%s", user.get_confirmed())
    if (user.get_confirmed()):
        return user.authenticate(password)
    logging.warning("authenticate_user: user not confirmed for email=%s", email)
    return False

def confirm_user(user):
    # set the user to confirmed
    userobj = get_user(user)
    if userobj == None:
        return
    userobj.set_confirmed()
    set_user(userobj)

def update_password(user, password):
    #  update the password
    userobj = get_user(user)
    if userobj == None:
        return
    userobj.set_password(password)
    set_user(userobj)

def get_user_dongle(user):
    userobj = get_user(user)
    if userobj == None:
        return None
    return userobj.get_dongle()
        
def set_user_dongle(user, dongle):
    userobj = get_user(user)
    if userobj == None:
        return
    userobj.set_dongle(dongle)
    set_user(userobj)



# if userdir does not exist, create it


if "__name__" == "__main__":
    #create_user("test","test")
    pass
    
