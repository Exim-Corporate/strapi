import { TeamMember } from './../../frontend/.nuxt/components.d';
interface BlogPost {
  title: string;
  titleDescription: string;
  img: string;
  imgAlt?: string;
  imgDescription?: string;
  content: string;
  author: TeamMember;
}

interface TeamMember {
  name: string;
  position: string;
  img: string;
  imgAlt?: string;
  description: string;
}