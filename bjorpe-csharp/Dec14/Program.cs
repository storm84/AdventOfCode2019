using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dec14
{
	class Program
	{
		static List<Reaction> reactions = new List<Reaction>();
		static Dictionary<string, long> available = new Dictionary<string, long>();
		static long oreCount = 0;

		static void Main(string[] args)
		{
			var filename = @"input.txt";
			//var filename = @"test.txt";
			var file = new System.IO.StreamReader(filename);

			String line;
			while ((line = file.ReadLine()) != null)
			{
				var parts = line.Split(new string[] { " => " }, StringSplitOptions.None);
				var inputs = parts[0].Split(new string[] { ", " }, StringSplitOptions.None);
				var output = parts[1].Split(new string[] { " " }, StringSplitOptions.None);

				var reaction = new Reaction
				{
					Inputs = new Dictionary<string, long>(),
					OutputAmount = long.Parse(output[0]),
					OutputChemical = output[1]
				};

				foreach (var input in inputs)
				{
					var inputparts = input.Split(' ');
					reaction.Inputs.Add(inputparts[1], long.Parse(inputparts[0]));
				}
				reactions.Add(reaction);
			}

			long fuelProduced = 0;

			do
			{
				Produce("FUEL", 1);
				//if (fuelProduced % 1000 == 0) Console.WriteLine("Ore " + oreCount + " Fuel " + fuelProduced);
				fuelProduced++;
			} while (available.Any(a => a.Value * 10000 > fuelProduced ));

			Console.WriteLine("Ore " + oreCount + " Fuel " + fuelProduced);

			foreach (var chem in available.Keys.ToList())
			{
				Console.WriteLine(chem + ": " + available[chem]);
			}

			long totalOre = 1000000000000;

			long cycles = (totalOre / oreCount);
			fuelProduced = fuelProduced * cycles;
			oreCount = oreCount * cycles;

			foreach (var chem in available.Keys.ToList())
			{
				available[chem] = available[chem] * cycles;
			}


			//Console.WriteLine("Cycles: " + cycles);
			Console.ReadLine();

			while (oreCount < totalOre)
			{
				Console.WriteLine("Ore " + oreCount + " Fuel " + fuelProduced);
				//Console.ReadLine();
				Produce("FUEL", 1);
				if (oreCount < totalOre)
				{
					fuelProduced++;
				}
			}



			Console.ReadLine();
		}

		static void Produce(string chemical, long amout)
		{
			//Console.WriteLine("Produce " + amout + " " + chemical);
			var reaction = reactions.First(r => r.OutputChemical == chemical);
			long produced = 0;
			while(produced < amout)
			{
				foreach (var input in reaction.Inputs)
				{
					long need = input.Value;
					if (input.Key == "ORE")
					{
						//Console.WriteLine("Consume " + need + " ORE");
						oreCount += need;
						continue;
					}
					long availInput = available.ContainsKey(input.Key) ? available[input.Key] : 0;
					if (need > availInput)
					{
						Produce(input.Key, need - availInput);
					}

					//Console.WriteLine("Consume " + need + " " + input.Key);
					available[input.Key] -= need;
				}

				produced += reaction.OutputAmount;

				if (chemical == "FUEL") continue;

				if (available.ContainsKey(reaction.OutputChemical))
				{
					available[reaction.OutputChemical] += reaction.OutputAmount;
				}
				else
				{
					available.Add(reaction.OutputChemical, reaction.OutputAmount);
				}
			}
		}
	}

	public class Reaction
	{
		public Dictionary<string, long> Inputs { get; set; }
		public long OutputAmount { get; set; }
		public string OutputChemical { get; set; }
	}
}
