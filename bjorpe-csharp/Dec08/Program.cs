using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dec08
{
	class Program
	{
		static void Main(string[] args)
		{
			var filename = @"input.txt";
			//var filename = @"test.txt";
			var file = new System.IO.StreamReader(filename);

			int width = 25;
			int height = 6;
			//int width = 2;
			//int height = 2;

			//int fewest0 = int.MaxValue;
			//int[] bestFreq = new int[10];

			String line = file.ReadLine();

			var digits = line.ToCharArray().Select(c => int.Parse(c.ToString())).ToList();
			int current = 0;

			int[,] image = new int[height,width];
			int layer = 0;

			while(current < digits.Count)
			{
		
				for(int row=0; row < height; row++)
				{
					for (int col = 0; col < width; col++)
					{
						if (layer == 0 || image[row, col] == 2)
						{
							image[row, col] = digits[current];
						}
						Console.Write(image[row, col] == 1 ? "+" : " ");
						current++;
					}
					Console.WriteLine();
				}
				layer++;

				Console.WriteLine();

				//Console.WriteLine(freq[0]);
				//if(freq[0] < fewest0)
				//{
				//	fewest0 = freq[0];
				//	bestFreq = freq;
				//}
			}

			//Console.WriteLine("");
			//Console.WriteLine(fewest0);
			//Console.WriteLine(bestFreq[1]);
			//Console.WriteLine(bestFreq[2]);
			//Console.WriteLine(bestFreq[1] * bestFreq[2]);

			Console.ReadLine();
		}
	}
}
