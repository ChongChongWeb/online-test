//将num左补0为len长度的字符串
export function lpadNum(num, len) {
    var l = num.toString().length;
    while(l < len) {
        num = "0" + num;
        l++;
    }
    return num;
}

//将传入的Date格式化为"yyyy-MM-dd HH:mm:ss"
export function formatDate(d){

    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var resStr = year + "-" +  lpadNum(month, 2) + "-" + lpadNum(day, 2) 
                    + " " + lpadNum(hours,2) + ":" + lpadNum(minutes,2) 
                    + ":" + lpadNum(seconds,2);
    return resStr;
}

// 字符串转换为时间
export function parseDate(str){

    str = str.replace(/-/g, "/");
    return new Date(str);
}

// 获取指定时间的对象
export function getDateObj(d){

    return {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
        hour: d.getHours(),
        minute: d.getMinutes(),
        second: d.getSeconds(),
    }
}

/**
 * 比较两个数字的大小
 * num1 < num2 返回 -1
 * num1 == num2 返回 0
 * num1 > num2 返回 1
 * */ 
export function contrastNums(num1, num2){

    if(num1 < num2){

        return -1;
    }else if(num1 == num2){

        return 0;
    }else{

        return 1;
    }
}

/**
 * 指定时间和当前时间对比
 * -1 早 指定时间小于当前时间
 * 0  指定时间等于当前时间
 * 1 晚 指定时间大于当前时间
 *  */ 
export function contrastNow(str){

    let time1 = getDateObj(parseDate(str));
    let time2 = getDateObj(new Date());

    let year = contrastNums(time1.year, time2.year);

    if(year==0){

        let month = contrastNums(time1.month+1, time2.month+1);
        if(month==0){

            let day = contrastNums(time1.day, time2.day);
            if(day==0){

                let hour = contrastNums(time1.hour, time2.hour);
                if(hour==0){

                    return contrastNums(time1.minute, time2.minute);
                }else{

                    return hour;
                }
            }else{
                return day;
            }
        }else{
            return month;
        }
    }else{
        return year;
    }
}

/**
 * 倒计时
 */
export function countDown(startTime, endTime){

    let startDate = new Date(startTime);
    let endDate = new Date(endTime);

    let temp1 = new Date();
    temp1.setTime(endDate.getTime() - startDate.getTime());

    return {
        h: parseInt(parseInt(endDate - startDate) / 1000 / 60 / 60),
        m: parseInt(parseInt(endDate - startDate) / 1000 / 60 % 60),
        s: parseInt(parseInt(endDate - startDate) / 1000 % 60)
    }
}

// 格式化倒计时
export function formatCountDown(h, m, s){

    let resl = "";

    if(h.toString().length < 2){

        resl =  resl + "0" + h;
    }else{

        resl =  resl + h;
    }

    if(m.toString().length < 2){

        resl =  resl + ":" + "0" + m;
    }else{

        resl =  resl + ":" + m;
    }
    
    if(s.toString().length < 2){

        resl =  resl + ":" + "0" + s;
    }else{

        resl =  resl + ":" + s;
    }

    return resl;
}

// 判断倒计时是否达到
export function contrastCountDown(h, m, s){

    if(h==0 && m==0 && s==0){
        return true;
    }else{
        return false;
    }
}