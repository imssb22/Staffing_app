"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../dist/db/db"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Example skill sets
        const skillSets = [
            [
                { name: 'React', proficiency: 'Expert' },
                { name: 'Node.js', proficiency: 'Advanced' },
                { name: 'Redux', proficiency: 'Advanced' },
                { name: 'TypeScript', proficiency: 'Advanced' },
                { name: 'MongoDB', proficiency: 'Intermediate' },
                { name: 'Express', proficiency: 'Advanced' },
            ],
            [
                { name: 'Python', proficiency: 'Expert' },
                { name: 'Django', proficiency: 'Advanced' },
                { name: 'Flask', proficiency: 'Intermediate' },
                { name: 'PostgreSQL', proficiency: 'Advanced' },
                { name: 'Celery', proficiency: 'Intermediate' },
                { name: 'Docker', proficiency: 'Advanced' },
            ],
            [
                { name: 'Java', proficiency: 'Expert' },
                { name: 'Spring Boot', proficiency: 'Advanced' },
                { name: 'Hibernate', proficiency: 'Advanced' },
                { name: 'MySQL', proficiency: 'Advanced' },
                { name: 'Maven', proficiency: 'Intermediate' },
                { name: 'JUnit', proficiency: 'Intermediate' },
            ],
            [
                { name: 'Angular', proficiency: 'Expert' },
                { name: 'TypeScript', proficiency: 'Expert' },
                { name: 'RxJS', proficiency: 'Advanced' },
                { name: 'NgRx', proficiency: 'Intermediate' },
                { name: 'Jasmine', proficiency: 'Intermediate' },
                { name: 'HTML', proficiency: 'Expert' },
            ],
            [
                { name: 'Vue', proficiency: 'Expert' },
                { name: 'Vuex', proficiency: 'Advanced' },
                { name: 'Nuxt', proficiency: 'Intermediate' },
                { name: 'JavaScript', proficiency: 'Expert' },
                { name: 'CSS', proficiency: 'Advanced' },
                { name: 'Sass', proficiency: 'Intermediate' },
            ],
            [
                { name: 'Go', proficiency: 'Expert' },
                { name: 'Gin', proficiency: 'Advanced' },
                { name: 'Gorm', proficiency: 'Intermediate' },
                { name: 'Docker', proficiency: 'Advanced' },
                { name: 'Kubernetes', proficiency: 'Intermediate' },
                { name: 'PostgreSQL', proficiency: 'Advanced' },
            ],
            [
                { name: 'Ruby', proficiency: 'Expert' },
                { name: 'Rails', proficiency: 'Expert' },
                { name: 'RSpec', proficiency: 'Advanced' },
                { name: 'Sidekiq', proficiency: 'Intermediate' },
                { name: 'PostgreSQL', proficiency: 'Advanced' },
                { name: 'Redis', proficiency: 'Intermediate' },
            ],
            [
                { name: 'PHP', proficiency: 'Expert' },
                { name: 'Laravel', proficiency: 'Expert' },
                { name: 'Symfony', proficiency: 'Advanced' },
                { name: 'MySQL', proficiency: 'Expert' },
                { name: 'Composer', proficiency: 'Intermediate' },
                { name: 'Blade', proficiency: 'Intermediate' },
            ],
            [
                { name: 'C#', proficiency: 'Expert' },
                { name: '.NET', proficiency: 'Expert' },
                { name: 'Entity Framework', proficiency: 'Advanced' },
                { name: 'Azure', proficiency: 'Intermediate' },
                { name: 'SQL Server', proficiency: 'Expert' },
                { name: 'Blazor', proficiency: 'Intermediate' },
            ],
            [
                { name: 'Flutter', proficiency: 'Expert' },
                { name: 'Dart', proficiency: 'Expert' },
                { name: 'Firebase', proficiency: 'Advanced' },
                { name: 'Bloc', proficiency: 'Intermediate' },
                { name: 'REST API', proficiency: 'Advanced' },
                { name: 'GraphQL', proficiency: 'Intermediate' },
            ],
            [
                { name: 'Swift', proficiency: 'Expert' },
                { name: 'iOS', proficiency: 'Expert' },
                { name: 'SwiftUI', proficiency: 'Advanced' },
                { name: 'CoreData', proficiency: 'Intermediate' },
                { name: 'Combine', proficiency: 'Intermediate' },
                { name: 'Realm', proficiency: 'Intermediate' },
            ],
            [
                { name: 'Kotlin', proficiency: 'Expert' },
                { name: 'Android', proficiency: 'Expert' },
                { name: 'Jetpack', proficiency: 'Advanced' },
                { name: 'Coroutines', proficiency: 'Advanced' },
                { name: 'Room', proficiency: 'Intermediate' },
                { name: 'Dagger', proficiency: 'Intermediate' },
            ],
            [
                { name: 'SQL', proficiency: 'Expert' },
                { name: 'PostgreSQL', proficiency: 'Expert' },
                { name: 'MySQL', proficiency: 'Expert' },
                { name: 'MongoDB', proficiency: 'Advanced' },
                { name: 'Redis', proficiency: 'Advanced' },
                { name: 'Oracle', proficiency: 'Intermediate' },
            ],
            [
                { name: 'MongoDB', proficiency: 'Expert' },
                { name: 'Express', proficiency: 'Expert' },
                { name: 'Node.js', proficiency: 'Expert' },
                { name: 'React', proficiency: 'Expert' },
                { name: 'Redux', proficiency: 'Advanced' },
                { name: 'TypeScript', proficiency: 'Advanced' },
            ],
            [
                { name: 'AWS', proficiency: 'Expert' },
                { name: 'Lambda', proficiency: 'Advanced' },
                { name: 'DynamoDB', proficiency: 'Advanced' },
                { name: 'S3', proficiency: 'Expert' },
                { name: 'CloudFormation', proficiency: 'Intermediate' },
                { name: 'EC2', proficiency: 'Advanced' },
            ],
            [
                { name: 'Azure', proficiency: 'Expert' },
                { name: 'Functions', proficiency: 'Advanced' },
                { name: 'CosmosDB', proficiency: 'Intermediate' },
                { name: 'CI/CD', proficiency: 'Expert' },
                { name: 'Docker', proficiency: 'Advanced' },
                { name: 'Kubernetes', proficiency: 'Intermediate' },
            ],
            [
                { name: 'HTML', proficiency: 'Expert' },
                { name: 'CSS', proficiency: 'Expert' },
                { name: 'JavaScript', proficiency: 'Expert' },
                { name: 'Sass', proficiency: 'Advanced' },
                { name: 'Bootstrap', proficiency: 'Advanced' },
                { name: 'Tailwind', proficiency: 'Intermediate' },
            ],
            [
                { name: 'JavaScript', proficiency: 'Expert' },
                { name: 'TypeScript', proficiency: 'Expert' },
                { name: 'React', proficiency: 'Expert' },
                { name: 'Next.js', proficiency: 'Advanced' },
                { name: 'Redux', proficiency: 'Advanced' },
                { name: 'Jest', proficiency: 'Intermediate' },
            ],
            [
                { name: 'GraphQL', proficiency: 'Expert' },
                { name: 'Apollo', proficiency: 'Advanced' },
                { name: 'Relay', proficiency: 'Intermediate' },
                { name: 'Node.js', proficiency: 'Advanced' },
                { name: 'TypeScript', proficiency: 'Advanced' },
                { name: 'React', proficiency: 'Advanced' },
            ],
            [
                { name: 'C++', proficiency: 'Expert' },
                { name: 'Qt', proficiency: 'Advanced' },
                { name: 'Boost', proficiency: 'Intermediate' },
                { name: 'OpenGL', proficiency: 'Advanced' },
                { name: 'CMake', proficiency: 'Intermediate' },
                { name: 'STL', proficiency: 'Expert' },
            ],
            [
                { name: 'Perl', proficiency: 'Advanced' },
                { name: 'Mojolicious', proficiency: 'Intermediate' },
                { name: 'DBI', proficiency: 'Intermediate' },
                { name: 'Dancer', proficiency: 'Beginner' },
                { name: 'Catalyst', proficiency: 'Beginner' },
                { name: 'CGI', proficiency: 'Intermediate' },
            ],
            [
                { name: 'Elixir', proficiency: 'Expert' },
                { name: 'Phoenix', proficiency: 'Expert' },
                { name: 'Ecto', proficiency: 'Advanced' },
                { name: 'Absinthe', proficiency: 'Intermediate' },
                { name: 'Nerves', proficiency: 'Beginner' },
                { name: 'LiveView', proficiency: 'Intermediate' },
            ],
            [
                { name: 'Haskell', proficiency: 'Advanced' },
                { name: 'Yesod', proficiency: 'Intermediate' },
                { name: 'Servant', proficiency: 'Beginner' },
                { name: 'Persistent', proficiency: 'Intermediate' },
                { name: 'Conduit', proficiency: 'Beginner' },
                { name: 'Cabal', proficiency: 'Intermediate' },
            ],
            [
                { name: 'Scala', proficiency: 'Expert' },
                { name: 'Akka', proficiency: 'Advanced' },
                { name: 'Play', proficiency: 'Advanced' },
                { name: 'Slick', proficiency: 'Intermediate' },
                { name: 'Spark', proficiency: 'Advanced' },
                { name: 'Cats', proficiency: 'Intermediate' },
            ],
            [
                { name: 'Rust', proficiency: 'Advanced' },
                { name: 'Rocket', proficiency: 'Intermediate' },
                { name: 'Actix', proficiency: 'Intermediate' },
                { name: 'Diesel', proficiency: 'Intermediate' },
                { name: 'Serde', proficiency: 'Advanced' },
                { name: 'Tokio', proficiency: 'Intermediate' },
            ],
            [
                { name: 'Dart', proficiency: 'Expert' },
                { name: 'Flutter', proficiency: 'Expert' },
                { name: 'Firebase', proficiency: 'Advanced' },
                { name: 'Bloc', proficiency: 'Intermediate' },
                { name: 'GetX', proficiency: 'Intermediate' },
                { name: 'Riverpod', proficiency: 'Beginner' },
            ],
            [
                { name: 'PHP', proficiency: 'Expert' },
                { name: 'Laravel', proficiency: 'Expert' },
                { name: 'Symfony', proficiency: 'Advanced' },
                { name: 'CodeIgniter', proficiency: 'Intermediate' },
                { name: 'Zend', proficiency: 'Beginner' },
                { name: 'CakePHP', proficiency: 'Intermediate' },
            ],
            [
                { name: 'JavaScript', proficiency: 'Expert' },
                { name: 'Jest', proficiency: 'Advanced' },
                { name: 'Mocha', proficiency: 'Intermediate' },
                { name: 'Chai', proficiency: 'Intermediate' },
                { name: 'Cypress', proficiency: 'Intermediate' },
                { name: 'Testing Library', proficiency: 'Intermediate' },
            ],
            [
                { name: 'AWS', proficiency: 'Expert' },
                { name: 'EC2', proficiency: 'Expert' },
                { name: 'S3', proficiency: 'Expert' },
                { name: 'Lambda', proficiency: 'Advanced' },
                { name: 'CloudFormation', proficiency: 'Intermediate' },
                { name: 'RDS', proficiency: 'Advanced' },
            ],
            [
                { name: 'Docker', proficiency: 'Expert' },
                { name: 'Kubernetes', proficiency: 'Expert' },
                { name: 'Helm', proficiency: 'Advanced' },
                { name: 'Prometheus', proficiency: 'Intermediate' },
                { name: 'Grafana', proficiency: 'Intermediate' },
                { name: 'Istio', proficiency: 'Beginner' },
            ],
            [
                { name: 'Jenkins', proficiency: 'Expert' },
                { name: 'CI/CD', proficiency: 'Expert' },
                { name: 'Git', proficiency: 'Expert' },
                { name: 'Maven', proficiency: 'Advanced' },
                { name: 'Gradle', proficiency: 'Advanced' },
                { name: 'SonarQube', proficiency: 'Intermediate' },
            ],
        ];
        for (let i = 0; i < 30; i++) {
            const skillSet = skillSets[i % skillSets.length];
            const dev = yield db_1.default.developer.create({
                data: {
                    name: `Developer${i + 1}`,
                    YOE: Math.floor(Math.random() * 10) + 1,
                    email: `dev${i + 1}@example.com`,
                    phone: `90000000${i + 1}`,
                    password: 'password123',
                    rating: Math.round((Math.random() * 5 + 3) * 10) / 10, // 3.0 - 8.0
                    hrate: Math.floor(Math.random() * 1000) + 500, // e.g. 500 - 1499
                    skills: {
                        create: skillSet.map(skill => ({
                            name: skill.name,
                            proficiency: skill.proficiency,
                        })),
                    },
                },
            });
            console.log(`Created ${dev.name}`);
        }
    });
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.$disconnect();
}));
