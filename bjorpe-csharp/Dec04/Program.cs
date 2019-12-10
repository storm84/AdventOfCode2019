using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dec04
{
	class Program
	{
		static void Main(string[] args)
		{
			//372037-905157
			int lower = 372037;
			int upper = 905157;

			int matches = 0;

			for (int i = lower; i <= upper; i++ )
			{
				bool doubleDigits = false;
				bool nonDecrease = true;
				var digits = i.ToString().ToCharArray();
				for(int j = 0; j < 5; j++)
				{
					if(digits[j] > digits[j + 1])
					{
						nonDecrease = false;
						break;
					}
					doubleDigits = doubleDigits || 
						(digits[j] == digits[j + 1] && (j==0 || digits[j - 1] != digits[j]) && (j == 4 || digits[j +2 ] != digits[j]));
				}
				if (nonDecrease && doubleDigits)
				{
					matches++;
					Console.WriteLine(i);
				}
			}
			Console.WriteLine(matches);
			Console.ReadLine();
		}
	}
}
