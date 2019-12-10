using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Numerics;

namespace Dec09
{
	class Program
	{
		static void Main(string[] args)
		{
			var filename = @"input.txt";
			//var filename = @"test2.txt";
			var file = new System.IO.StreamReader(filename);

			String line = file.ReadLine();
			var code = line.Split(',').Select(c => BigInteger.Parse(c)).ToList();


			var cpu = new IntcodeComputer(code);
			cpu.AddInput(2);
			while (!cpu.Done)
			{
				var output = cpu.Run();
				Console.Write(output + ",");
			}

			
			Console.ReadLine();
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
