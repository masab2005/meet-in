import mongoose, { Schema, Document, model, models } from 'mongoose';


export interface IMessage extends Document {
  from: mongoose.Types.ObjectId; 
  to: mongoose.Types.ObjectId;   
  content: string;
  timestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

  
const Message = models.Message || model<IMessage>('Message', MessageSchema,"messages");
export default Message;
