#include <stdio.h>
#include <stdlib.h>

long calculateFuel(long in1)
{
	long fuel = in1/3 - 2;

	if(fuel <= 0)
		return 0;
	else
		return fuel + calculateFuel(fuel);
}

int main(void) {

	long in1 = 0;
	long sum = 0;

	while(scanf("%ld", &in1) == 1)
		sum += calculateFuel(in1);

	printf("Answer: %ld\n", sum);

	return 0;
}
