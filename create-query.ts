const _ = require('lodash')

export default function createQuery(params:{[key:string]:string}):{text:string,values:string[]} {

    var cols = ['calldatetime','priority','district','description','callnumber','incidentlocation','calldatetime2'];
    var dateCols = ['calldatetime2']

    var i = 1

    var wheresAndValues = _.chain(params).pick(cols).map((value,col) => {
        if (dateCols.indexOf(col) === -1) {
            return [
                'lower(' + col + ')' + ' LIKE lower($' + (i++) + ')',
                '%' + value + '%'
            ]
        } else {
            return [
                col + ' >= $' + (i++),
                'to_timestamp(\'' + value + '\', \'YYYY-MM-DD HH24:MI:SS\')::timestamp without time zone'
            ]            
        }
    }).unzip().value()

    var queryConfig = {
        text:'SELECT * FROM calls ' + (wheresAndValues.length > 0 ? 'WHERE ' + wheresAndValues[0].join(' AND ') + ' ': ''),
        values:wheresAndValues[1] || []
    }

    if (params.orderBy && cols.indexOf(params.orderBy.toLowerCase()) !== -1) {
        queryConfig.text += 'ORDER BY ' + params.orderBy + ' '
        if (params.orderByDesc) {
            queryConfig.text += 'DESC '
        }
    }

    queryConfig.text += 'LIMIT 1000'

    return queryConfig
}