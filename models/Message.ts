import mongoose, { Schema, Document, model, models } from 'mongoose';


export interface IMessage extends Document {
  from: mongoose.Types.ObjectId; 
  to: mongoose.Types.ObjectId;   
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }
);

MessageSchema.index({ from: 1, to: 1, createdAt: -1 });
MessageSchema.index({ to: 1, from: 1, createdAt: -1 });
  
const Message = models.Message || model<IMessage>('Message', MessageSchema,"messages");
export default Message;
