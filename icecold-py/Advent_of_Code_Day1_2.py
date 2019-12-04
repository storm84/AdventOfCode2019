import math

def main():
    file = 'Advent_of_Code_Day1_2_input.txt'
    sum = 0

    f = open(file, "r")
    for x in f:
        input = x.strip()
        print ("input: " + str(input))
        sub = calc(input)
        fuel_for_fuel = sub

        if fuel_for_fuel > 0:
            print("Requires more fuel!")
            print ("------------------------------")
            while fuel_for_fuel > 0:
                sub = calc(fuel_for_fuel)

                if sub > 0:
                    sum = sum + fuel_for_fuel
                    fuel_for_fuel = sub
                    print ("sum: " + str(sum))
                else:
                    sum = sum + fuel_for_fuel
                    print ("sum: " + str(sum))
                    fuel_for_fuel = 0
                    print("Finished! ")

                print ("------------------------------")

        else:
            sum = sum + fuel_for_fuel
            print ("sum: " + str(sum))

    print ("total sum: " + str(sum))

def calc(input):
    div = int(input) / 3
    print ("div: " + str(div))

    round = math.floor(div)
    print ("round: " + str(round))

    sub = round - 2
    print ("sub: " + str(sub))

    return sub

if __name__ == "__main__":
    main()



