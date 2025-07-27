import {Connection} from 'mongoose';

declare global{ // global presists hot reloading in development
    var mongoose:{
        conn : Connection | null; //is connected
        promise: Promise<Connection> | null; //or else wait to connect promise to complete
    }
}

export {}