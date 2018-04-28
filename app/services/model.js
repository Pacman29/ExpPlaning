export default class Model{
  static experiment(N, lambda, myu){
    let dT = 0.0001;

    let queue = [];


    let next_m = lambda();
    let next_w = myu();

    let t_free = true;
    let time_res = 0;
    let n = N;

    for(let t = 0; (n > 0) || (queue.length > 0); t+=dT ){
      if((next_m <= t) && (n>0)){
        queue.push(true);
        do{
          next_m += lambda();
          n--;
        }while ((next_m<t) && (n !== 0));
      }
      if(queue.length > 0){
        if(t_free){
          queue.pop();
          t_free = false;
          next_w += myu();
        }
        time_res += dT ;
      }

      if(!t_free && (next_w <= t))
        t_free = true;
    }

    time_res /= N;
    return time_res;
  }
}
