savetemplate1 = """{"numsheets":3,"currentid":"sheet1","currentname":"test1","sheetArr":{"sheet1":{"sheetstr":{"savestr":"version:1.5"""
savetemplate2 = """},"name":"test1"},"sheet2":{"sheetstr":{"savestr":"version:1.5"""
savetemplate3 = """},"name":"test2"},"sheet3":{"sheetstr":{"savestr":"version:1.5"""
savetemplate4 = """},"name":"test3"}}}"""


class SocialCalcCell:

#    the following function builds a cell object from a cell substring 
#    for eg. buildfrom ("A3:v:3:c:2\u000a",formatstring) gives us an object 
#    which contains the A3 cell and the associated information like the value 3 
#    in it, and the colour corresponding to the second color in the color array

    def buildcellfrommscobject(cellstring, formatstring):
        #initialising 
        self.coord=""
        self.value=""
        self.datatype="t"
        self.border="(0,0,0,0):(0,0,0,0):(0,0,0,0):(0,0,0,0)" #the first component in each group corresponds to the existence of a border at that edge 
        # and the other three the rgb components of the border at that edge
        self.layout=""
        self.textcolor="(0,0,0)"
        self.bgcolor="(0,0,0)"
        self.cellformat=""
        self.textformat=""
        self.nontextformat=""
        
        
        styledict=buildstyledict(formatstring)
        
        
        Borderarray=styledict[0]
        Layoutarray=styledict[1]
        Fontarray=styledict[2]
        Colorarray=styledict[3]
        CellFormatarray=styledict[4]
        TextFormatarray=styledict[5]
        NonTextFormatarray=styledict[6]
        
        #now once we have the various style element dictionaries we need to decode the cell string to get the complete cell object
        
        cellparts=cellstring.split(":")
        self.coord=cellparts[0]
        self.datatype=cellparts[1]
        self.value=cellparts[2]
        n=len(cellparts)
        for i in range(3, n):
            if (cellparts[i]=="b"):
                
                topstring=cellparts[i+1]
                rightstring=cellparts[i+2]
                bottomstring=cellparts[i+3]
                leftstring=cellparts[i+4]
                if topstring==""
            #elif(cellparts[i]==):
                
        
        
#class Sheet:
#the following function builds a format dictionaory for the given format string in the msc file, giving all the style elements present in the sheet
def buildstyledict(formatstring):
    Borderarray=[]
    Layoutarray=[]
    Fontarray=[]
    Colorarray=[]
    CellFormatarray=[]
    TextFormatarray=[]
    NonTextFormatarray=[]
    Formatelements=formatstring.split("\u000a")
    for formatelement in Formatelements:
        elementparts=formatelement.split(":")
        if elementparts[0]=="border":
            Borderarray.append(elementparts[2])
        elif elementsparts[0]=="": #I don't know the representation of layout array tag in the msc format and all the ones which have not been filled in.
            Layoutarray.append(elementparts[2])
        elif elementsparts[0]=="color":
            Colorarray.append(elementparts[2])
        elif elementsparts[0]=="":
            CellFormatarray.append(elementparts[2])
        elif elementsparts[0]=="tvf":
            TextFormatarray.append(elementparts[2])
        elif elementsparts[0]=="":
            NonTextFormatarray.append(elementparts[2])
    return [Borderarray, Layoutarray, Colorarray, CellFormatarray, TextFormatarray, NonTextFormatarray]

#class Workbook:
	

def parseCell(parts):
    print parts

def parseSocialCalcLine(line):
   #print line
   parts = line.split(":")
   if parts[0] == "cell":
       parseCell(parts)

def parseSocialCalc(str):
   #print str
   lines = str.split("\n")
   for i in lines:
       parseSocialCalcLine(i)

def parseJson(str):
   workbook = json.loads(str)
   print workbook["numsheets"],workbook["currentname"]
   for sheet in workbook["sheetArr"]:
       print sheet, workbook["sheetArr"][sheet]["name"]
       parseSocialCalc(workbook["sheetArr"][sheet]["sheetstr"]["savestr"])


def generateSocialCalcSave():
   colnames = ["A","B","C","D","E","F","G","H","I","J","K"]
   rowrange = range(1,11)

   output = ""

   for r in rowrange:
       for c in colnames:
           if c == "A":
               valuetype = "t"
           else:
               valuetype = "v"
           if c != "A":
               value = str(r)
           else:
               value = "Hello"+str(r)
           output = output + "cell"+":"+c+str(r)+":"+valuetype+":"+value+r"\n"
   output1 = output
   output2 = output
   output3 = output
   output = savetemplate1+"\\n"+output1+'"'+savetemplate2+"\\n"+output2+'"'+savetemplate3+"\\n"+output3+'"'+savetemplate4
   return output

if __name__ == "__main__":
   import sys
   filename = sys.argv[1]
   data = open(filename).read()
   parseJson(data)
   #print generateSocialCalcSave()
