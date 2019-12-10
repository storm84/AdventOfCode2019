using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dec05
{
	class Program
	{
		static void Main(string[] args)
		{
			var filename = @"input.txt";
			//var filename = @"test.txt";
			var input = 5;
			var file = new System.IO.StreamReader(filename);

			String line = file.ReadLine();
			int paramLength = 0;

			var code = line.Split(',').Select(c => int.Parse(c)).ToList();

			for (int i = 0; i < code.Count; i += paramLength)
			{
				int opcode = code[i] % 100;

				if (opcode == 99) break;

				var mode1 = code[i] / 100 % 10;
				var param1 = mode1 == 0 ? code[i + 1] : i + 1;
				paramLength = 2;

				if (opcode == 3)
				{
					code[param1] = input;
					continue;
				}
				if (opcode == 4)
				{
					Console.WriteLine(code[param1]);
					continue;
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
			//Console.WriteLine(String.Join(",", code));
			Console.ReadLine();
		}
	}
}
