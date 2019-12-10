using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dec01
{
	class Program
	{
		static void Main(string[] args)
		{
			var filename = @"input.txt";
			//var filename = @"test.txt";
			var file = new System.IO.StreamReader(filename);

			int sum = 0;
			int row = 0;
			String line;
			while ((line = file.ReadLine()) != null)
			{
				if (int.TryParse(line, out row))
				{
					sum += GetFuel2(row);
				}
			}
			Console.WriteLine(sum);
			Console.ReadLine();
		}

		private static int GetFuel(int mass)
		{
			return (mass / 3) - 2;
		}

		private static int GetFuel2(int mass)
		{
			int fuel = (mass / 3) - 2;
			if (fuel <= 0) return 0;

			return fuel + GetFuel2(fuel);
		}
	}
}
