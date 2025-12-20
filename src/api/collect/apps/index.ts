import request from '/@/utils/request';


export function getList(query:Object) {
    return request({
        url: '/api/v1/collect/apps/list',
        method: 'get',
        params:query
    })
}

export function getItem(uuid:string) {
    return request({
        url: '/api/v1/collect/apps/get',
        method: 'get',
        params:{uuid}
    })
}

export function addItem(data:any) {
    return request({
        url: '/api/v1/collect/apps/add',
        method: 'post',
        data:data
    })
}

export function editItem(data:any) {
    return request({
        url: '/api/v1/collect/apps/edit',
        method: 'put',
        data:data
    })
}

export function deleteItem(uuids:string[]) {
    return request({
        url: '/api/v1/collect/apps/delete',
        method: 'delete',
        data:{uuids}
    })
}
