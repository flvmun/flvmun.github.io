function initCalendar(){
	$('.add-note .date').zabuto_calendar({
		language: "ru",
		cell_border:true,
		today:true,
		nav_icon:{
			prev:'<i class="fa fa-arrow-left date-prev"></i>',
			next:'<i class="fa fa-arrow-right date-next"></i>'
		}
	});

	var today = $('.zabuto_calendar table td .today').html();

	$('.add-note .date table td div.day').each(function(){
		var day = $(this).html();
		$(this).html('<span class="badge">'+day+'</span>');
	});

	$('.add-note .date table td .today').html(today);
}

function uploadData(){
	var text = $('.add-note .text').val();
	var date = $('.add-note .date table td .today').attr('id').match(/(\d{4})-(\d{2})\-(\d{2})/);
	var time = $('.add-note .time').val()+':00';
	if(text.length == 0){
		$('.add-note .error').html('Введите текст');
		return false;
	}
	$('.add-note .error').empty();
	$('.list-notes').append(
		'<div class="note"><div class="date">'+
			'<input type="checkbox" class="form-check-input task-done">'+
			'<i class="fa fa-clock-o"></i>'+
			'<span class="date-val" date="'+date[0]+'">'+date[0]+'</span>'+
			'<span class="time-val">'+time+'</span>'+
		'</div><div class="text">'+text+'</div></div>'
	);

	sortData();
}

function sortData(){
	var list = [];
	$('.list-notes .note .date').each(function(){
		var date = $(this).find('.date-val').attr('date').match(/(\d{4})-(\d{2})\-(\d{2})/)[0];
		var time = $(this).find('.time-val').text().match(/(\d{2}):(\d{2}):(\d{2})/)[0];
		var text = $(this).parents('.note').find('.text').html();
		var done = $(this).find('.task-done').attr('done');
		if(done === undefined){
			done = false;
		}
		list.push({'date':date,'time':time,'text':text,'done':done});
	});

	list.sort(function(a,b){
		var f = Date.parse(a['date']+' '+a['time']).getTime()/1000;
		var s = Date.parse(b['date']+' '+b['time']).getTime()/1000;
		return new Date(s) - new Date(f);
	});

	var result = '';
	list.forEach(function(e){
		var date = new Date(e['date']+' '+e['time']).toString('d MMM yyyy HH:mm:ss');
		result +=
		'<div class="note" '+(e['done']?'style="opacity:0.3;cursor:default;"':'')+'><div class="date">'+
			'<input type="checkbox" class="form-check-input task-done" '+(e['done']?'done="true" checked="checked" disabled="true"':'')+'>'+
			'<i class="fa fa-clock-o"></i>'+
			'<span class="date-val" date="'+e['date']+'">'+date+'</span>'+
			'<span class="time-val">'+e['time']+'</span>'+
		'</div><div class="text">'+e['text']+'</div></div>';
	});
	$('.list-notes').html(result);
}

function taskDone(task){
	task.css('opacity','0.3');
	task.css('cursor','default');
	task.find('.task-done').attr('disabled',true);
	task.find('.task-done').attr('done',true);
	sortData();
}

$(function(){

	$('.add-note .text').autogrow();

	initCalendar();

	$('.clockpicker').clockpicker({
		autoclose: true
	});

	$(document).on('click','.add-note .date table td div .badge',function(){
		$('.add-note .date table td div .badge').removeClass('badge-today');
		$(this).addClass('badge-today');
		$('.add-note .date table td .day').removeClass('today');
		$(this).parent('div').addClass('today');
	});

	$(document).on('click','.add-note .submit',function(){
		uploadData();
	});

	$(document).on('click','.date-prev',function(){
		$('.add-note .date table td div.day').each(function(){
			var day = $(this).html();
			$(this).html('<span class="badge">'+day+'</span>');
		});
	});

	$(document).on('click','.date-next',function(){
		$('.add-note .date table td div.day').each(function(){
			var day = $(this).html();
			$(this).html('<span class="badge">'+day+'</span>');
		});
	});

	$(document).on('click','.task-done',function(){
		var task = $(this).parents('.note');
		taskDone(task);
	});
});