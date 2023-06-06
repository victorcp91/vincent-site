export interface IMain {
    id: number
    attributes: {
      title: string
      subtitle: string
    }
  }
  
export interface IHomeData {
    id: number
    attributes: {
      about: string
      email: string
      phone: string
      address: string
      phone_link: string
      address_link: string
      profile_picture: {
        url: string
        width: number
        height: number
      }
    }
}

export interface IPreprint {
    id: number
    attributes: {
        author: string
        title: string
        year: string
        link?: string
        file?: {
            url: string
        }
    }
}

export interface IPublication {
    id: number
    attributes: {
        author: string
        title: string
        year: string
        link?: string
        file?: {
            url: string
        }
        issue?: string
        volume?: string
        pages?: string
        journal?: string
    }
}

export interface IProject {
  id: number
  name: string
  description: string
  link: string
}