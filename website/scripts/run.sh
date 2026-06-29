export PYTHONPATH="/home/ubuntu/tornado-2.4"
nohup python ../app/run.py --port=10000 > /dev/null 2> /dev/null < /dev/null &
nohup python ../app/run.py --port=10001 > /dev/null 2> /dev/null < /dev/null &
nohup python ../app/run.py --port=10002 > /dev/null 2> /dev/null < /dev/null &
nohup python ../app/run.py --port=10003 > /dev/null 2> /dev/null < /dev/null &
