using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _3dec
{
    class Program
    {
        static Dictionary<Tuple<int, int>, int> getPath(string input)
        {
            Dictionary<Tuple<int, int>, int> thisPath = new Dictionary<Tuple<int, int>, int>();

            int x = 0, y = 0, totLength = 0;

            foreach (var p in input.Split(','))
            {
                var direction = p[0];
                var length = int.Parse(p.Remove(0, 1));

                for (int i = 0; i < length; i++)
                {
                    totLength++;
                    if (direction == 'U')
                    {
                        Tuple<int, int> thisTuple = new Tuple<int, int>(x, ++y);
                        if (!thisPath.ContainsKey(thisTuple))
                            thisPath.Add(thisTuple, totLength);
                    }
                    else if (direction == 'D')
                    {
                        Tuple<int, int> thisTuple = new Tuple<int, int>(x, --y);
                        if (!thisPath.ContainsKey(thisTuple))
                            thisPath.Add(thisTuple, totLength);
                    }
                    else if (direction == 'R')
                    {
                        Tuple<int, int> thisTuple = new Tuple<int, int>(++x, y);
                        if (!thisPath.ContainsKey(thisTuple))
                            thisPath.Add(thisTuple, totLength);
                    }
                    else if (direction == 'L')
                    {
                        Tuple<int, int> thisTuple = new Tuple<int, int>(--x, y);
                        if (!thisPath.ContainsKey(thisTuple))
                            thisPath.Add(thisTuple, totLength);
                    }
                    else
                    {
                        // Should never get here!!!
                        Console.WriteLine("Warning!!! Unknown direction " + direction);
                        return null;
                    }

                }
            }

            return thisPath;
        }

        static int findMinDist(Tuple<int, int>[] intersections)
        {
            int dist = int.MaxValue;
            foreach (Tuple<int, int> p in intersections)
            {
                if ((Math.Abs(p.Item1) + Math.Abs(p.Item2)) < dist)
                    dist = (Math.Abs(p.Item1) + Math.Abs(p.Item2));
            }

            return dist;
        }

        static int findMinDelay(Tuple<int, int>[] intersections, Dictionary<Tuple<int, int>, int>[] paths)
        {
            int delay = int.MaxValue;
            foreach (Tuple<int, int> p in intersections)
            { 
                int[] delays = new int[2];
                paths[0].TryGetValue(p, out delays[0]);
                paths[1].TryGetValue(p, out delays[1]);
                if ((delays[0] + delays[1]) < delay)
                    delay = delays[0] + delays[1];
            }

            return delay;
        }


        static void Main(string[] args)
        {
            // Neeeeeeded a bigger buffer for input
            byte[] inputBuffer = new byte[10000];
            Stream inputStream = Console.OpenStandardInput(inputBuffer.Length);
            Console.SetIn(new StreamReader(inputStream, Console.InputEncoding, false, inputBuffer.Length));

            // Get input
            string[] input = new string[2];
            input[0] = Console.ReadLine();
            input[1] = Console.ReadLine();

            //Console.WriteLine("1st - " + input[0]);
            //Console.WriteLine("2nd - " + input[1]);

            // Translate into paths
            Dictionary<Tuple<int, int>, int>[] paths = new Dictionary<Tuple<int, int>, int>[2];
            paths[0] = getPath(input[0]);
            paths[1] = getPath(input[1]);


            // Find intersections 
            Tuple<int, int>[] intersections = paths[0].Keys.Intersect(paths[1].Keys).ToArray();

            // Find min distance
            Console.WriteLine("Min dist:  " + findMinDist(intersections));
            Console.WriteLine("Min delay: " + findMinDelay(intersections, paths)); 

            Console.Read();
        }
    }
}
