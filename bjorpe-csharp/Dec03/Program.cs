using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dec03
{
	class Program
	{
		static void Main(string[] args)
		{
			var filename = @"input.txt";
			//var filename = @"test.txt";
			var file = new System.IO.StreamReader(filename);

			var allPoints = new List<Point>();
			int nearestIntersect = int.MaxValue;

			String line;
			int wire = 0;
			while ((line = file.ReadLine()) != null)
			{
				var parts = line.Split(',').ToList();
				var points = new List<Point>();
				var pos = new Point();

				foreach(var part in parts)
				{
					var direction = part[0];
					var length = int.Parse(part.Remove(0, 1));
					for(int i = 1; i <= length; i ++)
					{
						pos.Go(direction);
						points.Add(pos);
					}
				}

				if (wire == 0)
				{
					allPoints.AddRange(points);
				}
				else
				{
					int length = 1;
					foreach (var point in points)
					{
						if (length < nearestIntersect && allPoints.Contains(point))
						{
							int distance = length + allPoints.IndexOf(point) + 1;
							nearestIntersect = Math.Min(nearestIntersect, distance);
						}
						length++;
						//if (point.GetDistance() < nearestIntersect && allPoints.Contains(point))
						//{
						//	nearestIntersect = point.GetDistance();
						//}
					}
				}
				wire++;
			}
			Console.WriteLine(nearestIntersect);
			Console.ReadLine();
		}
	}

	public struct Point
	{
		public int X { get; set; }
		public int Y { get; set; }

		public void Go(char direction)
		{
			if (direction == 'R') X++;
			else if (direction == 'L') X--;
			else if (direction == 'U') Y++;
			else if (direction == 'D') Y--;
		}

		public int GetDistance()
		{
			return Math.Abs(X) + Math.Abs(Y);
		}
	}	
}
