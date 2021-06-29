import Point from '@mapbox/point-geometry'
import { Zxy, TileCache, TileSource } from '../src/tilecache'
import { View } from '../src/view'
import { StubSource } from './test_helpers'
import assert from 'assert'
import baretest from 'baretest'

let test = baretest("view")

let cache = new TileCache(new StubSource(),1024)

test('basic, level diff = 0', async () => {
    let view = new View(cache,3,0)
    let result = view.dataTileForDisplayTile({z:3,x:4,y:1})
    assert.deepEqual(result.data_tile,{z:3,x:4,y:1})
    assert.equal(result.scale,1)
    assert.deepEqual(result.origin,new Point(256*4,256*1))
    assert.equal(result.dim,1024)

    result = view.dataTileForDisplayTile({z:4,x:4,y:2})
    assert.deepEqual(result.data_tile,{z:3,x:2,y:1})
    assert.equal(result.scale,2)
    assert.deepEqual(result.origin,new Point(256*4,256*2))
    assert.equal(result.dim,2048)
})

test('level diff = 1', async () => {
    let view = new View(cache,3,1)
    let result = view.dataTileForDisplayTile({z:3,x:4,y:1})
    assert.deepEqual(result.data_tile,{z:2,x:2,y:0})
    assert.equal(result.scale,1)
    assert.deepEqual(result.origin,new Point(256*4,256*0))
    assert.equal(result.dim,1024)

    result = view.dataTileForDisplayTile({z:1,x:0,y:0})
    assert.deepEqual(result.data_tile,{z:0,x:0,y:0})
    assert.equal(result.scale,1)
    assert.deepEqual(result.origin,new Point(256*0,256*0))

    result = view.dataTileForDisplayTile({z:0,x:0,y:0})
    assert.deepEqual(result.data_tile,{z:0,x:0,y:0})
    assert.equal(result.scale,0.5)
    assert.deepEqual(result.origin,new Point(256*0,256*0))
    assert.equal(result.dim,512)
})

test('level diff = 2', async () => {
    let view = new View(cache,3,2)
    let result = view.dataTileForDisplayTile({z:5,x:9,y:13})
    assert.deepEqual(result.data_tile,{z:3,x:2,y:3})
    assert.equal(result.scale,1)
    assert.deepEqual(result.origin,new Point(256*8,256*12))
})

test('get center basic', async () => {
    let view = new View(cache,3,0)
})

// test('covering', async () => {
//     let view = new View(cache,2,2)
//     let covering = view.covering(4,{z:2,x:1,y:1},{minX:95,minY:100,maxX:150,maxY:110})
//     assert.deepEqual(covering,[{z:4,x:3,y:4}])
// })
// test('covering between corners', async () => {
//     let view = new View(cache,2,2)
//     let covering = view.covering(4,{z:2,x:1,y:1},{minX:95,minY:105,maxX:150,maxY:155})
//     assert.equal(covering.length,3)
// })

export default test