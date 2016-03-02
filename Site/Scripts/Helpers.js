function timeAgo(previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var current = new Date();

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return "همین الان";  
    }
    else if (elapsed < msPerMinute * 2) {
         return "یک دقیقه پیش"; 
    }
    else if (elapsed < msPerMinute * 60 ) {
         return Math.round(elapsed/msPerMinute ) + ' دقیقه پیش';   
    }
    else if (elapsed < msPerHour * 2) return "یک ساعت پیش";
    else if (elapsed < msPerHour * 24) {
        return  Math.round(elapsed/msPerHour) + ' ساعت پیش';   
    }
    else if (elapsed < msPerDay * 2) return "دیروز";
    else if (elapsed < msPerDay * 7){
        return Math.round(elapsed/msPerDay) + " روز پیش";
    }
    else if (elapsed < msPerDay * 14 )  return "هفته گذشته";
    else if (elapsed < msPerDay * 21) return "دو هفته پیش";
    else if (elapsed < msPerMonth) return "سه هفته پیش";
    else if (elapsed < msPerMonth * 2) return "ماه گذشته";
    else if (elapsed < msPerYear){
        return Math.round(elapsed/msPerMonth) + " ماه پیش";
    }
    else {
        return Math.round(elapsed/msPerYear ) + ' سال پیش';   
    }
}

function FullName(person){
    return person.getPersonFirstName + " " + person.getPersonLastName;
}

function getVolumeName (volume){
     return volume.getVolumeNumber() == 0
                ? volume.getBook().getBookName()
                : volume.getBook().getBookName() + " جلد(" + volume.getVolumeNumber() + ")";
}