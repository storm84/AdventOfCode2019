import math
file = 'Advent_of_Code_Day1_1_input.txt'
sum = 0

f = open(file, "r")
for x in f:
    input = x.strip()
    print ("input: " + input)
    div = int(input) / 3
    print ("div: " + str(div))
    round = math.floor(div)
    print ("round: " + str(round))
    sub = round - 2
    print ("sub: " + str(sub))
    sum = sum + sub
    print ("sum: " + str(sum))
    print ("------------------------------")

print ("total sum: " + str(sum))