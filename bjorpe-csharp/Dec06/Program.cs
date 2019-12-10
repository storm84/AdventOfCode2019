using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dec06
{
	class Program
	{
		private static Dictionary<string, string> orbits = new Dictionary<string, string>();

		static void Main(string[] args)
		{
			var filename = @"input.txt";
			//var filename = @"test.txt";
			var file = new System.IO.StreamReader(filename);
			var totalCount = 0;

			var shortestPath = int.MaxValue;

			String line;
			while ((line = file.ReadLine()) != null)
			{
				var parts = line.Split(')');
				orbits[parts[1]] = parts[0];
			}

			var path1 = PathToCom(orbits["YOU"]);
			var path2 = PathToCom(orbits["SAN"]);

			foreach(var step in path1)
			{
				if (path2.Contains(step))
				{
					shortestPath = Math.Min(shortestPath, path1.IndexOf(step) + path2.IndexOf(step));
				}
			}
			//totalCount = DistanceBetween(orbits["YOU"], orbits["SAN"]);
			//foreach (var planet in orbits.Keys)
			//{
			//	var planetOrbits = CountOrbits(planet);
			//	Console.WriteLine(planetOrbits);
			//	totalCount += planetOrbits;
			//}
			//Console.WriteLine(totalCount);
			Console.WriteLine(shortestPath);
			Console.ReadLine();
		}

		private static int CountOrbits(string planet)
		{
			if (planet == "COM") return 0;
			return 1 + CountOrbits(orbits[planet]);
		}


		private static List<string> PathToCom(string planet)
		{
			if (planet == "COM") return new List<string>();
			var path = PathToCom(orbits[planet]);
			path.Insert(0, planet);
			return path;
		}

		private static int DistanceBetween(string planetA, string planetB)
		{
			if (planetA == planetB) return 0;
			if (planetA == "COM") return 1 + DistanceBetween(planetA, orbits[planetB]);
			if (planetB == "COM") return 1 + DistanceBetween(planetB, orbits[planetA]);

			return 1 + Math.Min(DistanceBetween(orbits[planetA], planetB), DistanceBetween(planetA, orbits[planetB]));
		}
	}
}
