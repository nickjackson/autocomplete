var AutoComplete = require('autocomplete');

describe('AutoComplete', function(){
  var data = [{title:'one'}, {title:'two'}]
    , input;

  beforeEach(function(){
    input = document.createElement('input');
    input.setAttribute('type', 'text');
  })

  function respondWithData(q, fn){
    if (q && q.length > 0) fn(data);
  }

  function simpleTemplate(data, query, fn){
    fn(data.title)
  }

  it('should trigger query emitter', function(done){
    AutoComplete(input).on('query', function(query, fn){
      expect(query).to.be.eql('test123');
      expect(fn).to.be.a('function');
      done();
    });
    input.value = 'test123';
    input.onkeyup({});
  })

  it('should trigger template emitter', function(done){
    var count = 0;
    AutoComplete(input)
    .on('query', respondWithData)
    .on('template', function(result, query, fn){
      expect(data).to.contain(result);
      expect(query.text).to.eql('foobar');
      expect(query.results).to.have.length(2);
      fn(result.title);
      count++;
      if (count == 2) done();
    })

    input.value = 'foobar';
    input.onkeyup({});
  })

  it('should trigger rendered emitter', function(done){
    AutoComplete(input)
    .on('query', respondWithData)
    .on('template', simpleTemplate)
    .on('rendered', function(container){
      var html = container.innerHTML
        , match = '<li>one</li><li>two</li>';

      expect(html).to.eql(match);
      done();
    })

    input.value = 'test123';
    input.onkeyup({});
  })

  it('should trigger key up', function(done){
    AutoComplete(input)
    .on('keyup', function(){
      done();
    })
    input.onkeyup({});
  })

  it('should trigger key down', function(done){
    AutoComplete(input)
    .on('keydown', function(){
      done();
    })
    input.onkeydown({});
  })

  it('should trigger nav up', function(done){
    AutoComplete(input).on('nav up', done)
    var e = {keyCode: 38, preventDefault: function(){}}
    input.onkeydown(e);
  })

  it('should trigger nav down', function(done){
    AutoComplete(input).on('nav down', done)
    var e = {keyCode: 40, preventDefault: function(){}}
    input.onkeydown(e);
  })

  it('should trigger selected', function(done){
    input.value = 'test123';
    var check = 0;

    AutoComplete(input)
    .on('query', respondWithData)
    .on('template', simpleTemplate)
    .once('selected', function(item){
      console.log(item)
      expect(item.data).to.eql(data[0]);
      check++;
    })
    .emit('keyup', {})
    .emit('nav down')
    .once('selected', function(item){
      expect(item.data).to.eql(data[1]);
      check++;
      expect(check).to.eql(2);
      done();
    })
    .emit('nav down')
  })
})