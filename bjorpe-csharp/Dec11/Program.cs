using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Numerics;

namespace Dec11
{
	class Program
	{
		private static Dictionary<Tuple<int, int>, int> painted = new Dictionary<Tuple<int, int>, int>();

		static void Main(string[] args)
		{
			var filename = @"input.txt";
			var file = new System.IO.StreamReader(filename);

			String line = file.ReadLine();
			var code = line.Split(',').Select(c => BigInteger.Parse(c)).ToList();
			var cpu = new IntcodeComputer(code);
			var robot = new Robot();

			while (!cpu.Done)
			{
				var pos = robot.Pos;
				var oldColor = GetPaint(pos);
				cpu.AddInput(oldColor);
				var color = cpu.Run();
				if (cpu.Done) break;
				painted[pos] = (int)color;
				var turn = cpu.Run();
				robot.TurnAndGo((int)turn);
				Console.WriteLine($"{pos.Item1},{pos.Item2} OldCol:{oldColor} NewCol:{color} Turn:{turn} Dir:{robot.Direction}");
			}

			Console.WriteLine(painted.Count);

			for (int y = painted.Keys.Max(k => k.Item2); y >= painted.Keys.Min(k => k.Item2); y--)
			{
				for (int x = painted.Keys.Min(k => k.Item1); x <= painted.Keys.Max(k => k.Item1); x++)
				{
					var color = GetPaint(new Tuple<int, int>(x, y));
					Console.Write(color == 1 ? "*" : " ");
				}
				Console.WriteLine();
			}
			
			Console.ReadLine();
		}


		private static int GetPaint(Tuple<int, int> pos)
		{
			if (painted.ContainsKey(pos)) return painted[pos];
			if (pos.Item1 == 0 && pos.Item2 == 0) return 1;
			return 0;
		}
	}

	public class Robot
	{
		public Tuple<int, int> Pos => new Tuple<int, int>(x,y);

		public Direction Direction { get; set; }
		private int x = 0, y = 0;

		public void TurnAndGo(int where)
		{
			//Left
			if(where == 0)
			{
				if (Direction == Direction.Right) Direction = Direction.Up;
				else Direction++;
			}
			//Right
			else
			{
				if (Direction == Direction.Up) Direction = Direction.Right;
				else Direction--;
			}
			//Go
			if (Direction == Direction.Up) y++;
			if (Direction == Direction.Down) y--;
			if (Direction == Direction.Right) x++;
			if (Direction == Direction.Left) x--;
		}
	}

	public enum Direction
	{
		Up,
		Left,
		Down,
		Right
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
