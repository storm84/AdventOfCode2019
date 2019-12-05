using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _2dec
{
    class Program
    {
        public static string initIntCode; // Stores the initial intcode in string format

        static void printIntcode(int[] intCode)
        {
            Console.WriteLine("Size of program: " + intCode.Length);
            for (int i = 0; i < intCode.Length; i++)
            {
                Console.Write(intCode[i] + " ");
            }
            Console.Write("\n");
        }

        static int[] initIntcodeMem()
        {
            string[] split = initIntCode.Split(new char[] { ',' }, StringSplitOptions.None);
            
            int[] intCode = new int[split.Length];
            for (int i = 0; i < split.Length; i++)
            {
                intCode[i] = int.Parse(split[i]);
            }

            return intCode;
        }

        static bool runIntcodeProgram(int[] intCode)
        {
            //Console.Write("Computing... ");
            for(int i = 0; i < intCode.Length; i += 4)
            {
                //Console.Write("OP at " + i + " ");
                if (intCode[i] == 1)
                {
                    intCode[intCode[i+3]] = intCode[intCode[i+1]] + intCode[intCode[i+2]];
                }
                else if (intCode[i] == 2)
                {
                    intCode[intCode[i+3]] = intCode[intCode[i+1]] * intCode[intCode[i+2]];
                }
                else if (intCode[i] == 99)
                {
                    //Console.Write("EOP\n");
                    return true;
                }
                else
                {
                    // Should never happen (unknown OPCODE)
                    return false;
                }
            }

            // Should never run a program without EOP
            return false;
        }

        static void Main(string[] args)
        {
            // Neeeeeeded a bigger buffer for input
            byte[] inputBuffer = new byte[1024];
            Stream inputStream = Console.OpenStandardInput(inputBuffer.Length);
            Console.SetIn(new StreamReader(inputStream, Console.InputEncoding, false, inputBuffer.Length));

            // Get initial intcode memory - string form
            initIntCode = Console.ReadLine();
            int[] intCode = initIntcodeMem();

            printIntcode(intCode);

            if (!runIntcodeProgram(intCode))
                Console.WriteLine("FAIL!!!");
            printIntcode(intCode);


            /*
            // Our initial task
            // Insert 1202 program alarm
            intCode = initIntcodeMem();
            intCode[1] = 12;
            intCode[2] = 2;
            printIntcode(intCode);

            if (!runIntcodeProgram(intCode))
                Console.WriteLine("FAIL!!!");
            printIntcode(intCode);
            */

            // Our second task
            int lookingFor = 19690720;
            for (int i = 0; i < 100; i++)
            {
                for(int j = 0; j < 100; j++)
                {
                    intCode = initIntcodeMem();
                    intCode[1] = i;
                    intCode[2] = j;
                    //printIntcode(intCode);

                    runIntcodeProgram(intCode);
                    //printIntcode(intCode);
                    if (intCode[0] == lookingFor)
                    {
                        Console.WriteLine("Found it (" + lookingFor + ") at " + i + " and " + j);
                        Console.WriteLine("Answer is: " + (i * 100 + j));
                    }

                }
            }

            Console.ReadLine();
        }
    }
}
