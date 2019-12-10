using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dec07
{
	class Program
	{
		static void Main(string[] args)
		{
			var filename = @"input.txt";
			//var filename = @"test.txt";
			var file = new System.IO.StreamReader(filename);

			String line = file.ReadLine();
			var code = line.Split(',').Select(c => int.Parse(c)).ToList();

			int maxOutput = int.MinValue;

			//var combinations = GetCombinations(new List<int> { 0, 1, 2, 3, 4 }, new List<int>());
			var combinations = GetCombinations(new List<int> { 5, 6, 7, 8, 9 }, new List<int>());

			foreach (var settings in combinations)
			{
				//var settings = new List<int> { 9, 7, 8, 5, 6 };
				var computers = new List<IntcodeComputer>();
				for (int j = 0; j < 5; j++)
				{
					var cpu = new IntcodeComputer(code);
					cpu.AddInput(settings[j]);
					computers.Add(cpu);
				}
				
				var output = 0;
				var transfer = 0;
				var halt = false;

				while (!halt)
				{
					for (int i = 0; i < 5; i++)
					{
						computers[i].AddInput(transfer);
						output = computers[i].Run();
						if (computers[i].Done)
						{
							halt = true;
							break;
						}
						transfer = output;
					}
					maxOutput = Math.Max(maxOutput, transfer);
					Console.WriteLine(transfer);
				}
			}

			Console.WriteLine(maxOutput);
			Console.ReadLine();
		}

		private static List<List<int>> GetCombinations(List<int> values, List<int> tail)
		{
			var result = new List<List<int>>();
			if (values.Count == 1)
			{
				tail.Insert(0, values[0]);
				result.Add(tail);
				return result;
			}

			foreach (var value in values)
			{
				var rest = values.Where(v => v != value).ToList();
				var newTail = new List<int> { value };
				newTail.AddRange(tail);
				var x = GetCombinations(rest, newTail);
				result.AddRange(x);
			}
			return result;
		}
	}


	public class IntcodeComputer
	{
		private List<int> code = new List<int>();
		private List<int> input = new List<int>();
		private int iState = 0;
		private int inputIndex = 0;

		public IntcodeComputer(List<int> code)
		{
			this.code.AddRange(code);
		}

		public bool Done { get; set; }

		public void AddInput(int value)
		{
			input.Add(value);
		}

		public int Run()
		{
			int paramLength = 0;

			if (Done) return 0;

			for (int i = iState; i < code.Count; i += paramLength)
			{
				int opcode = code[i] % 100;

				if (opcode == 99) break;

				var mode1 = code[i] / 100 % 10;
				var param1 = mode1 == 0 ? code[i + 1] : i + 1;
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

				var mode2 = code[i] / 1000 % 10;
				var param2 = mode2 == 0 ? code[i + 2] : i + 2;
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
				var param3 = mode3 == 0 ? code[i + 3] : i + 3;
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
	}


}
