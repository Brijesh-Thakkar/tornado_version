#nohup ./main.py > foo.out 2> foo.err < /dev/null &

nohup ./amazonwebapp.py --port=9000 > /dev/null 2> /dev/null < /dev/null &
nohup ./amazonwebapp.py --port=9001 > /dev/null 2> /dev/null < /dev/null &
nohup ./amazonwebapp.py --port=9002 > /dev/null 2> /dev/null < /dev/null &
nohup ./amazonwebapp.py --port=9003 > /dev/null 2> /dev/null < /dev/null &
