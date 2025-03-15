
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Search, ChevronRight, Database, LineChart, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      <div className="animate-fadeIn">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Discover Winning Patterns in Lottery Data
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Advanced analytics and pattern recognition for lottery enthusiasts. Search through historical data, analyze trends, and make informed decisions.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link to={user ? "/dashboard" : "/login"}>
                  <Button className="bg-primary-400 hover:bg-primary-500">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/search">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-primary-400">Advanced Analytics</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to analyze lottery data
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Powerful tools to help you identify patterns, trends, and potential winning combinations.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-400">
                      <Search className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    Pattern Search
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Search for specific number sequences, lappings, and patterns in historical data.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-400">
                      <Database className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    Historical Data
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Access comprehensive historical lottery draw data and statistics.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-400">
                      <LineChart className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    Analytics
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Powerful analytics tools to help you identify trends and patterns.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Ready to start analyzing?
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Join thousands of lottery enthusiasts who use our platform to make data-driven decisions.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link to="/premium">
                  <Button className="bg-primary-400 hover:bg-primary-500">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
