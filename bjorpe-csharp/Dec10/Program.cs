using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dec10
{
	class Program
	{
		//private static int width = 20;
		private static int width = 24;
		private static int height = width;
		private static bool[,] planetMap = new bool[width, height];

		static void Main(string[] args)
		{
			var filename = @"input.txt";
			//var filename = @"test4.txt";
			var file = new System.IO.StreamReader(filename);

			var planetList = new List<Tuple<int, int>>();
			int[,] sights = new int[width, height];

			String line;
			int row = 0;
			while ((line = file.ReadLine()) != null)
			{
				var parts = line.ToCharArray();
				for (int col = 0; col < width; col++)
				{
					if (parts[col] == '#')
					{
						planetMap[col, row] = true;
						planetList.Add(new Tuple<int, int>(col, row));
					}
				}
				row++;
			}

			//int maxSights = 0;
			//for (int y=0; y < height; y++)
			//{
			//	for (int x=0; x < width; x++)
			//	{
			//		if (planetMap[x,y])
			//		{
			//			foreach(var planet in planetList)
			//			{
			//				if(LineOfSight(x,y,planet.Item1,planet.Item2))
			//				{
			//					sights[x, y]++;
			//				}
			//			}
			//			Console.Write(" " + sights[x, y].ToString("D3"));
			//			maxSights = Math.Max(maxSights, sights[x, y]);
			//		}
			//		else
			//		{
			//			Console.Write("  . ");
			//		}
			//	}
			//	Console.WriteLine();
			//}
			//Console.WriteLine(maxSights);

			//int x = 11;
			//int y = 13;
			int x = 14;
			int y = 17;

			var angleOrdered = planetList.Where(p => !(p.Item1 == x && p.Item2 == y)).OrderBy(p => AngleFunction(x, y, p.Item1, p.Item2)).ToList();
			int vap = 0;
			int i = 0;

			do
			{
				var next = angleOrdered[i % angleOrdered.Count];
				if (LineOfSight(x, y, next.Item1, next.Item2))
				{
					vap++;
					Console.WriteLine(vap + " Vap " + next.Item1 + "," + next.Item2);
					angleOrdered.RemoveAt(i);
				}
				else
				{
					i++;
				}

			} while (vap < 200);

			Console.ReadLine();
		}

		private static double AngleFunction(int x, int y, int targetX, int targetY)
		{
			double deltaX = targetX - x;
			double deltaY = targetY - y;

			if (deltaY < 0 && deltaX >= 0) return Math.Atan(- deltaX / deltaY);
			if (deltaY >= 0 && deltaX > 0) return Math.PI/2 + Math.Atan(deltaY / deltaX);
			if (deltaY > 0 && deltaX <= 0) return Math.PI + Math.Atan(- deltaX / deltaY);
			return Math.PI * 3/2 + Math.Atan(deltaY / deltaX);
		}

		private static bool LineOfSight(int x, int y, int targetX, int targetY)
		{
			if (x == targetX && y == targetY) return false;

			int deltaX = targetX - x;
			int deltaY = targetY - y;

			if (Math.Abs(deltaX) <= 1 && Math.Abs(deltaY) <= 1) return true;

			if (deltaX == 0)
			{
				for (int step = 1; step < Math.Abs(deltaY); step++)
				{
					int middleY = y + Math.Sign(deltaY) * step;
					if (planetMap[x, middleY]) return false;
				}
				return true;
			}

			if (deltaY == 0)
			{
				for (int step = 1; step < Math.Abs(deltaX); step++)
				{
					int middleX = x + Math.Sign(deltaX) * step;
					if (planetMap[middleX, y]) return false;
				}
				return true;
			}

			if (deltaX % deltaY == 0)
			{
				int mult = Math.Abs(deltaX / deltaY);
				for (int step = 1; step < Math.Abs(deltaY); step++)
				{
					int middleX = x + Math.Sign(deltaX) * mult * step;
					int middleY = y + Math.Sign(deltaY) * step;
					if (planetMap[middleX, middleY]) return false;
				}
			}

			if (deltaY % deltaX == 0)
			{
				int mult = Math.Abs(deltaY / deltaX);
				for (int step = 1; step < Math.Abs(deltaX); step++)
				{
					int middleX = x + Math.Sign(deltaX) * step;
					int middleY = y + Math.Sign(deltaY) * mult * step;
					if (planetMap[middleX, middleY]) return false;
				}
			}

			for (int div = 2; div < Math.Min(Math.Abs(deltaX), Math.Abs(deltaY)); div++)
			{
				if (deltaX % div == 0 && deltaY % div == 0)
				{
					int multX = deltaX / div;
					int multY = deltaY / div;

					for (int i= 1; i * Math.Abs(multX) < Math.Abs(deltaX); i++)
					{
						int middleX = x + multX * i;
						int middleY = y + multY * i;
						if (planetMap[middleX, middleY]) return false;
					}


				}
			}

			return true;
		}
	}
}
