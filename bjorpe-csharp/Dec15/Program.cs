using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;


namespace Dec15
{
	class Program
	{
		private static Dictionary<Pos, int> World = new Dictionary<Pos, int>();
		private static List<BigInteger> code;
		//private static bool found = false;
		private static Pos foundPos;

		static void Main(string[] args)
		{
			var filename = @"input.txt";
			var file = new System.IO.StreamReader(filename);

			String line = file.ReadLine();
			code = line.Split(',').Select(c => BigInteger.Parse(c)).ToList();

			var candidates = new Dictionary<Pos, List<int>>();
			candidates.Add(new Pos(0, 0), new List<int>());
			var newCandidates = new Dictionary<Pos, List<int>>();
			//while (!found && candidates.Count > 0)
			while (candidates.Count > 0)
			{
				var place = candidates.First();
				candidates.Remove(place.Key);
				Console.WriteLine(place.Key + ":" + place.Value.Count);
				var newPlaces = Find(place.Value, place.Key);
				foreach (var newPlace in newPlaces)
				{
					candidates.Add(newPlace.Key, newPlace.Value);
				}
			}

			Draw();
			int minutes = 1;

			while (World.Values.Any(v => v == 1))
			{
				var points = World.Where(w => w.Value == 2).ToDictionary(w => w.Key);
				foreach (var point in points)
				{
					for (int direction = 1; direction <= 4; direction++)
					{

						int targetX = point.Key.X;
						int targetY = point.Key.Y;

						//N
						if (direction == 1) targetY++;
						//S
						if (direction == 2) targetY--;
						//W
						if (direction == 3) targetX--;
						//E
						if (direction == 4) targetX++;

						var newPoint = new Pos(targetX, targetY);
						if (World[newPoint] == 1) World[newPoint] = 2;
					}
				}
				Console.WriteLine(minutes++);
				//Draw();
			}
			Draw();
			Console.ReadLine();
		}

		private static void Draw()
		{
			for (int y = World.Keys.Min(k => k.Y); y <= World.Keys.Max(k => k.Y); y++)
			{
				for (int x = World.Keys.Min(k => k.X); x <= World.Keys.Max(k => k.X); x++)
				{
					var pos = new Pos(x, y);
					var status = World.ContainsKey(pos) ? World[pos] : -1;
					var tile = status == -1 ? " "
						: status == 0 ? "#"
						: status == 1 ? "."
						: status == 2 ? "O"
						: status.ToString();
					Console.Write(tile);
				}
				Console.WriteLine();
			}
		}

		private static Dictionary<Pos, List<int>> Find(List<int> path, Pos pos)
		{
			var result = new Dictionary<Pos, List<int>>();

			for (int direction = 1; direction <= 4; direction++)
			{
				int status = 0;
				var cpu = new IntcodeComputer(code);
				foreach (var dir in path)
				{
					cpu.AddInput(dir);
					status = (int)cpu.Run();
					if (status != 1) Console.WriteLine("Unexpected status " + status);
				}

				int targetX = pos.X;
				int targetY = pos.Y;

				//N
				if (direction == 1) targetY++;
				//S
				if (direction == 2) targetY--;
				//W
				if (direction == 3) targetX--;
				//E
				if (direction == 4) targetX++;

				var newPos = new Pos(targetX, targetY);
				if (World.ContainsKey(newPos)) continue;

				cpu.AddInput(direction);
				status = (int)cpu.Run();
				World.Add(newPos, status);

				if (status == 0) continue;

				var newPath = new List<int>();
				newPath.AddRange(path);
				newPath.Add(direction);
				result.Add(newPos, newPath);

				if (status == 2)
				{
					//found = true;
					foundPos = newPos;
					Console.WriteLine($"Found! {newPos}: {newPath.Count}");
					//break;
				}

			}
			return result;
		}
	}


	public struct Pos
	{
		public Pos(int x, int y)
		{
			X = x;
			Y = y;
		}
		public int X { get; set; }
		public int Y { get; set; }

		public override string ToString()
		{
			return X + "," + Y;
		}
	}

	public class IntcodeComputer
	{
		private DictionaryWithDefault code = new DictionaryWithDefault();
		private List<int> input = new List<int>();
		private BigInteger iState = 0;
		private int inputIndex = 0;
		private BigInteger relativeBase = 0;

		public IntcodeComputer(List<BigInteger> code)
		{
			for (int c = 0; c < code.Count; c++)
			{
				this.code[c] = code[c];
			}
		}

		public bool Done { get; set; }

		public void AddInput(int value)
		{
			input.Add(value);
		}

		public BigInteger Run()
		{
			int paramLength = 0;

			if (Done) return 0;

			for (BigInteger i = iState; i < code.Count; i += paramLength)
			{
				var opcode = code[i] % 100;

				if (opcode == 99) break;

				var mode1 = code[i] / 100 % 10;
				var param1 = GetParam(i + 1, mode1);
				paramLength = 2;

				if (opcode == 3)
				{
					code[param1] = input[inputIndex++];
					continue;
				}
				if (opcode == 4)
				{
					iState = i + paramLength;
					return code[param1];
				}
				if (opcode == 9)
				{
					relativeBase += code[param1];
					continue;
				}

				var mode2 = code[i] / 1000 % 10;
				var param2 = GetParam(i + 2, mode2);
				paramLength = 3;

				if (opcode == 5)
				{
					if (code[param1] != 0)
					{
						i = code[param2];
						paramLength = 0;
					}
					continue;
				}

				if (opcode == 6)
				{
					if (code[param1] == 0)
					{
						i = code[param2];
						paramLength = 0;
					}
					continue;
				}

				var mode3 = code[i] / 10000 % 10;
				var param3 = GetParam(i + 3, mode3);
				paramLength = 4;

				if (opcode == 1)
				{
					code[param3] = code[param1] + code[param2];
				}
				if (opcode == 2)
				{
					code[param3] = code[param1] * code[param2];
				}
				if (opcode == 7)
				{
					code[param3] = code[param1] < code[param2] ? 1 : 0;
				}
				if (opcode == 8)
				{
					code[param3] = code[param1] == code[param2] ? 1 : 0;
				}
			}
			Done = true;
			return 0;
		}

		private BigInteger GetParam(BigInteger address, BigInteger mode)
		{
			if (mode == 0) return code[address];
			if (mode == 1) return address;
			if (mode == 2) return relativeBase + code[address];
			throw new Exception();
		}
	}

	public class DictionaryWithDefault : Dictionary<BigInteger, BigInteger>
	{
		BigInteger _default = 0;
		public DictionaryWithDefault() : base() { }

		public new BigInteger this[BigInteger key]
		{
			get
			{
				BigInteger t;
				return base.TryGetValue(key, out t) ? t : _default;
			}
			set { base[key] = value; }
		}
	}


}
