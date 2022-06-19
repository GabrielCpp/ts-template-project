import { Todo } from "@/core/domains";
import { Settings } from "@/settings";
import fetch from "axios";


export class BlogApi {
  baseUrl: string 

  constructor(settings: Settings) {
    this.baseUrl = settings.blogBaseUrl
  }

  async publish(todo: Todo) {
    const response = await fetch(`${this.baseUrl}/publish/todo`,{
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      data: JSON.stringify(todo)
    })
  }
}