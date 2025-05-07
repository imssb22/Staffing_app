

export interface Developer{
    id :      string,
    name:     string,
    YOE:      number,
    email:    string,
    phone:    string,
    password: string,
    rating:   number

}
export interface User {
      id :      string
      name:     string,
      email:    string,
      company:  string,
      password: string,
      phone:    string,
      rating:   number
}
export interface Project {
    id:                  string,
    name:                string,
    roomid:              string, 
    created_by:          string,
    budget:              number, 
    timeline:            number,
    required_developers: number
}
export interface Skill {
    name : string,
    proficiency : string
    developer_id : string
}


