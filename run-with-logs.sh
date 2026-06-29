#nohup ./main.py > foo.out 2> foo.err < /dev/null &

nohup ./cloudmain.py --port=8000 > /home/ubuntu/logs/cloudmain/8000.log 2> /home/ubuntu/logs/cloudmain/8000.err < /dev/null &
nohup ./cloudmain.py --port=8001 > /home/ubuntu/logs/cloudmain/8000.log 2> /home/ubuntu/logs/cloudmain/8000.err < /dev/null &
nohup ./cloudmain.py --port=8002 > /home/ubuntu/logs/cloudmain/8000.log 2> /home/ubuntu/logs/cloudmain/8000.err < /dev/null &
nohup ./cloudmain.py --port=8003 > /home/ubuntu/logs/cloudmain/8000.log 2>  /home/ubuntu/logs/cloudmain/8000.err < /dev/null &
