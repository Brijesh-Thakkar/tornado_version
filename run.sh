#nohup ./main.py > foo.out 2> foo.err < /dev/null &

nohup ./cloudmain.py --port=8000 > /dev/null 2> /dev/null < /dev/null &
nohup ./cloudmain.py --port=8001 > /dev/null 2> /dev/null < /dev/null &
nohup ./cloudmain.py --port=8002 > /dev/null 2> /dev/null < /dev/null &
nohup ./cloudmain.py --port=8003 > /dev/null 2> /dev/null < /dev/null &
