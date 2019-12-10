using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dec02
{
	class Program
	{
		static void Main(string[] args)
		{
			var filename = @"input.txt";
			//var filename = @"test.txt";
			var file = new System.IO.StreamReader(filename);

			String line = file.ReadLine();

			for (int noun= 0; noun <= 99; noun++)
			{
				for (int verb = 0; verb <= 99; verb++)
				{
					var code = line.Split(',').Select(c => int.Parse(c)).ToList();
					code[1] = noun;
					code[2] = verb;

					for (int i = 0; i < code.Count; i += 4)
					{
						int opcode = code[i];
						if (opcode == 99) break;
						if (opcode == 1)
						{
							code[code[i + 3]] = code[code[i + 1]] + code[code[i + 2]];
						}
						if (opcode == 2)
						{
							code[code[i + 3]] = code[code[i + 1]] * code[code[i + 2]];
						}
					}
					Console.WriteLine(String.Join(",", code));
					Console.WriteLine(code[0]);

					if (code[0] == 19690720)
					{
						Console.WriteLine(100 * noun + verb);
						Console.ReadLine();
						return;
					}
				}
			}

			
		}

	}
}
