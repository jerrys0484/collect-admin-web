import request from '/@/utils/request';


export function getList(query:Object) {
    return request({
        url: '/api/v1/collect/template/list',
        method: 'get',
        params:query
    })
}

export function getItem(uuid:string) {
    return request({
        url: '/api/v1/collect/template/get',
        method: 'get',
        params:{uuid}
    })
}

export function addItem(data:any) {
    return request({
        url: '/api/v1/collect/template/add',
        method: 'post',
        data:data
    })
}

export function editItem(data:any) {
    return request({
        url: '/api/v1/collect/template/edit',
        method: 'put',
        data:data
    })
}

export function deleteItem(uuids:string[]) {
    return request({
        url: '/api/v1/collect/template/delete',
        method: 'delete',
        data:{uuids}
    })
}
