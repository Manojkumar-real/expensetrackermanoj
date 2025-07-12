
import React from 'react';
import { ArrowRight, Github, ExternalLink, Mail, Phone, MapPin, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Portfolio: React.FC = () => {
  const skills = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Tailwind CSS',
    'Next.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Git', 'AWS'
  ];

  const projects = [
    {
      title: 'Expense Tracker App',
      description: 'A comprehensive expense tracking application with AI-powered savings recommendations and data visualization.',
      tech: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts'],
      github: '#',
      live: '#',
      image: '/placeholder.svg'
    },
    {
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration and admin dashboard.',
      tech: ['Next.js', 'Node.js', 'MongoDB', 'Stripe API'],
      github: '#',
      live: '#',
      image: '/placeholder.svg'
    },
    {
      title: 'Task Management System',
      description: 'Collaborative task management tool with real-time updates and team collaboration features.',
      tech: ['React', 'Socket.io', 'Express.js', 'PostgreSQL'],
      github: '#',
      live: '#',
      image: '/placeholder.svg'
    }
  ];

  const experience = [
    {
      role: 'Full Stack Developer',
      company: 'Tech Solutions Inc.',
      period: '2022 - Present',
      description: 'Developed and maintained web applications using React, Node.js, and cloud technologies.'
    },
    {
      role: 'Frontend Developer',
      company: 'Digital Agency',
      period: '2021 - 2022',
      description: 'Created responsive web interfaces and improved user experience for client projects.'
    },
    {
      role: 'Junior Developer',
      company: 'StartupCo',
      period: '2020 - 2021',
      description: 'Assisted in building MVP products and learned modern web development practices.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <img
              src="/placeholder.svg"
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-primary/20"
            />
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              John Developer
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Full Stack Developer & UI/UX Enthusiast
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Passionate about creating beautiful, functional web applications that solve real-world problems.
              I love turning ideas into reality through clean code and thoughtful design.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button size="lg" className="gap-2">
              <Mail className="w-4 h-4" />
              Contact Me
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Download className="w-4 h-4" />
              Download CV
            </Button>
          </div>

          <div className="flex justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Skills & Technologies</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg"></div>
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Github className="w-3 h-3" />
                      Code
                    </Button>
                    <Button size="sm" className="gap-2">
                      <ExternalLink className="w-3 h-3" />
                      Live Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Work Experience</h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{exp.role}</CardTitle>
                      <CardDescription className="text-lg font-medium text-primary">
                        {exp.company}
                      </CardDescription>
                    </div>
                    <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded">
                      {exp.period}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{exp.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-xl mb-8 opacity-90">
            I'm always open to discussing new opportunities and exciting projects.
          </p>
          <Button size="lg" variant="secondary" className="gap-2">
            Get In Touch
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} John Developer. Built with React & Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
