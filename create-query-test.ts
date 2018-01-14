import test from 'ava';
import createQuery from './create-query'

test('createQuery no params', t => {

	var params = {};
	var queryConfig = {
		text:'SELECT * FROM calls LIMIT 1000',
		values:[]
	};
	
	t.deepEqual(createQuery(params),queryConfig)
})


test('createQuery one param', t => {

	var params = {
		district:'NW'
	};
	var queryConfig = {
		text:'SELECT * FROM calls WHERE lower(district) LIKE lower($1) LIMIT 1000',
		values:['%NW%']
	};
	
	t.deepEqual(createQuery(params),queryConfig)	

})


test('createQuery all params', t => {

	var params = {
		calldatetime: '1',
		priority: '2',
		district: '3',
		description:'4',
		callnumber: '5',
		incidentlocation: '6',
	};
	var queryConfig = {
		text:'SELECT * FROM calls WHERE lower(calldatetime) LIKE lower($1) AND lower(priority) LIKE lower($2) AND lower(district) LIKE lower($3) AND lower(description) LIKE lower($4) AND lower(callnumber) LIKE lower($5) AND lower(incidentlocation) LIKE lower($6) LIMIT 1000',
		values:['%1%','%2%','%3%','%4%','%5%','%6%']
	};
	
	t.deepEqual(createQuery(params),queryConfig)	
});


test('createQuery all params and some extras', t => {

	var params = {
		calldatetime: '1',
		priority: '2',
		district: '3',
		description:'4',
		callnumber: '5',
		incidentlocation: '6',
		blah: 'yadda yadda'
	};
	var queryConfig = {
		text:'SELECT * FROM calls WHERE lower(calldatetime) LIKE lower($1) AND lower(priority) LIKE lower($2) AND lower(district) LIKE lower($3) AND lower(description) LIKE lower($4) AND lower(callnumber) LIKE lower($5) AND lower(incidentlocation) LIKE lower($6) LIMIT 1000',
		values:['%1%','%2%','%3%','%4%','%5%','%6%']
	};
	
	t.deepEqual(createQuery(params),queryConfig)	
});

	
test('createQuery order by with no where clause', t => {
	
	var params = {
		orderBy:'district'
	};
	var queryConfig = {
		text:'SELECT * FROM calls ORDER BY district LIMIT 1000',
		values:[]
	};
	
	t.deepEqual(createQuery(params),queryConfig)
})

test('createQuery order by desc with no where clause', t => {
	
	var params = {
		orderBy:'district',
		orderByDesc:'true'
	};
	var queryConfig = {
		text:'SELECT * FROM calls ORDER BY district DESC LIMIT 1000',
		values:[]
	};
	
	t.deepEqual(createQuery(params),queryConfig)
})

test('createQuery order by with where clause', t => {

	var params = {
		district:'NW',
		orderBy: 'district'
	};
	var queryConfig = {
		text:'SELECT * FROM calls WHERE lower(district) LIKE lower($1) ORDER BY district LIMIT 1000',
		values:['%NW%']
	};
	
	t.deepEqual(createQuery(params),queryConfig)	

})


test('createQuery with datetime col in where', t => {
	
		var params = {
			calldatetime2:'BLAH',
		};
		var queryConfig = {
			text:'SELECT * FROM calls WHERE calldatetime2 >= $1 LIMIT 1000',
			values:['to_timestamp(\'BLAH\', \'YYYY-MM-DD HH24:MI:SS\')::timestamp without time zone']
		};
		
		t.deepEqual(createQuery(params),queryConfig)	
	
	})
	