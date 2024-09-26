export interface InterfacePost {
  id?: string;
  title: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
  teacherId: string;
  keyWords: string[];
}

export interface InterfacePostsWithAuthor extends InterfacePost {
  authorName: string;
}

export interface InterfaceList<T> {
  data: T;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}
