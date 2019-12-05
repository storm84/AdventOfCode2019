// Dag 4
function a(input) {

const [start,end] = input.split('-').map(x=>+x)

let count = 0
for (let i=start;i<=end;i++){
	if(match2(i+''))count++
}

return count
}

// del 1
function match(num) {
	let last
	let hasDouble=false
	for (const d of num.split('')) {
		if (d===last) hasDouble=true

		if (d<last) return false

		last=d
	}

	return hasDouble
}

// del 2
function match2(num) {
	let last
	for (const d of num.split('')) {
		if (d<last) return false
		last=d
	}

	num=num.replace(/(.)\1{2,}/g, '')

	return /(.)\1/.test(num)
}


a('111111-111111')
// a('147981-691423')