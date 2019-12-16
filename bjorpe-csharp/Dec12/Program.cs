using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;

namespace Dec12
{
	class Program
	{
		static void Main(string[] args)
		{
			//Test
			//var planets = new List<Planet>
			//{
			//	new Planet(-1,  0, 2),
			//	new Planet( 2, -10, -7),
			//	new Planet( 4, -8, 8 ),
			//	new Planet( 3, 5,-1),
			//};
			//int steps = 10;

			var planets = new List<Planet>
			{
				new Planet( 1, -4, 3),
				new Planet(-14, 9, -4),
				new Planet(-4, -6, 7),
				new Planet( 6, -9, -11),
			};
			//int steps = 1000;
			int step = 1;
			Dictionary<char, int> periods = new Dictionary<char, int>();

			//for (int step = 0; step < steps; step++)
			while (periods.Count < 3)
			{
				//Gravity
				for (int i = 0; i < 4; i++)
				{
					planets[i].Gx = 0;
					planets[i].Gy = 0;
					planets[i].Gz = 0;
					for (int j = 0; j < 4; j++)
					{
						if (i == j) continue;
						planets[i].Gx += Math.Sign(planets[j].x - planets[i].x);
						planets[i].Gy += Math.Sign(planets[j].y - planets[i].y);
						planets[i].Gz += Math.Sign(planets[j].z - planets[i].z);
					}
				}
				//Velocity
				for (int i = 0; i < 4; i++)
				{
					planets[i].Vx += planets[i].Gx;
					planets[i].Vy += planets[i].Gy;
					planets[i].Vz += planets[i].Gz;
				}
				//Pos
				for (int i = 0; i < 4; i++)
				{
					planets[i].x += planets[i].Vx;
					planets[i].y += planets[i].Vy;
					planets[i].z += planets[i].Vz;

					//Console.WriteLine($"{step + 1} x {planets[i].x}, y {planets[i].y}, z {planets[i].z}  Vx {planets[i].Vx}, Vy {planets[i].Vy}, Vz {planets[i].Vz}");
				}
				if (!periods.ContainsKey('x') && planets.All(p => p.Vx == 0 && p.x == p.Sx))
				{
					periods['x'] = step;
					Console.WriteLine(step + " x");
				}
				if (!periods.ContainsKey('y') && planets.All(p => p.Vy == 0 && p.y == p.Sy))
				{
					periods['y'] = step;
					Console.WriteLine(step + " y");
				}
				if (!periods.ContainsKey('z') && planets.All(p => p.Vz == 0 && p.z == p.Sz))
				{
					periods['z'] = step;
					Console.WriteLine(step + " z");
				}
				step++;
				//Console.WriteLine(step++);
			}
			//Energy
			//var total = 0;
			//for (int i = 0; i < 4; i++)
			//{
			//	var pot = Math.Abs(planets[i].x) + Math.Abs(planets[i].y) + Math.Abs(planets[i].z);
			//	var kin = Math.Abs(planets[i].Vx) + Math.Abs(planets[i].Vy) + Math.Abs(planets[i].Vz);
			//	total += pot * kin;
			//	Console.WriteLine($"Pot {pot}, Kin {pot}, Tot {pot*kin}");
			//}
			//Console.WriteLine(total);

			//BigInteger num = 0;
			//while (true)
			//{
			//	num += periods.Values.Min();
			//	//Console.WriteLine(num);
			//	if (periods.Values.All(p => num % p == 0))
			//	{
			//		Console.WriteLine(num);
			//		break;
			//	}
			//}
			var numbers = periods.Values.Select(v => (Int64)v).ToArray();
			Console.WriteLine(LCM(numbers));


			//Console.WriteLine(step);
			Console.ReadLine();
		}

		static long LCM(long[] numbers)
		{
			return numbers.Aggregate(lcm);
		}
		static long lcm(long a, long b)
		{
			return Math.Abs(a * b) / GCD(a, b);
		}
		static long GCD(long a, long b)
		{
			return b == 0 ? a : GCD(b, a % b);
		}
	}

	public class Planet
	{
		public Planet(int x, int y, int z)
		{
			this.x = x;
			Sx = x;
			this.y = y;
			Sy = y;
			this.z = z;
			Sz = z;
		}

		public int x { get; set; }
		public int y { get; set; }
		public int z { get; set; }

		public int Sx { get; set; }
		public int Sy { get; set; }
		public int Sz { get; set; }

		public int Gx { get; set; }
		public int Gy { get; set; }
		public int Gz { get; set; }

		public int Vx { get; set; }
		public int Vy { get; set; }
		public int Vz { get; set; }
	}
}
