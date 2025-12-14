import request from '/@/utils/request';


export function getList(query:Object) {
    return request({
        url: '/api/v1/collect/steps/list',
        method: 'get',
        params: query
    })
}

export function getItem(uuid:string) {
    return request({
        url: '/api/v1/collect/steps/get',
        method: 'get',
        params: {uuid}
    })
}

export function addItem(data:any) {
    return request({
        url: '/api/v1/collect/steps/add',
        method: 'post',
        data: data
    })
}

export function editItem(data:any) {
    return request({
        url: '/api/v1/collect/steps/edit',
        method: 'put',
        data: data
    })
}

export function deleteItems(ids:string[]) {
    return request({
        url: '/api/v1/collect/steps/delete',
        method: 'delete',
        data: {ids}
    })
}

export function debugItems(data:any) {
    return request({
        url: '/api/v1/collect/steps/debug',
        method: 'post',
        data: data
    })
}
