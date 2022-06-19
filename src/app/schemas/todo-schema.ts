import { Type } from '@sinclair/typebox'

export const NewTodoSchema = Type.Object({                      
  summary: Type.String(),            
  content: Type.String()       
})                    
  

