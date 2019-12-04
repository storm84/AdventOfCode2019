using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _4dec
{
    class Program
    {
        static bool check6Digits(int value)
        {
            //Console.WriteLine("Value and is6: " + value + " " + (value.ToString().Length == 6));
            return (value.ToString().Length == 6);
        }

        // Behöver ha minst 2 av samma nummer, men i kombination med alltid ökande, så måste dessa hamna bredvid varandra
        static bool checkAtLeast2SameDigits(int value)
        {
            string valueStr = value.ToString();

            foreach(char a in valueStr)
            {
                if ((valueStr.Length - valueStr.Replace(a.ToString(), "").Length) > 1)
                    return true;
            }

            return false;
        }

        // Behöver ha exakt 2 av samma nummer, men i kombination med alltid ökande, så måste dessa hamna bredvid varandra
        static bool checkExact2SameDigits(int value)
        {
            string valueStr = value.ToString();

            foreach (char a in valueStr)
            {
                if ((valueStr.Length - valueStr.Replace(a.ToString(), "").Length) == 2)
                    return true;
            }

            return false;
        }


        static bool checkAlwaysIncrease(int value)
        {
            string valueStr = value.ToString();

            for(int i = 1; i < valueStr.Length; i++)
            {
                if (valueStr[i] < valueStr[i - 1])
                    return false;
            }

            return true;
        }

        static void solve(string input)
        {
            int min = int.Parse(input.Split('-')[0]);
            int max = int.Parse(input.Split('-')[1]);

            Console.WriteLine("Min = " + min + " and Max = " + max);

            // Task 1
            int counter = 0;
            for (int i = min; i <= max; i++)
            {
                if (check6Digits(i) && checkAtLeast2SameDigits(i) && checkAlwaysIncrease(i))
                    counter++;
            }
            Console.WriteLine("1: Amount of possible passwords: " + counter);

            // Task 2
            counter = 0;
            for (int i = min; i <= max; i++)
            {
                if (check6Digits(i) && checkExact2SameDigits(i) && checkAlwaysIncrease(i))
                    counter++;
            }

            Console.WriteLine("2: Amount of possible passwords: " + counter);

            Console.Read();
        }

        static void Main(string[] args)
        {
            // Get input
            string input = Console.ReadLine();

            solve(input);
        }
    }
}
