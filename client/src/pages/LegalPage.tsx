import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LegalPage() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const { t } = useTranslation();

  const content = {
    privacy: {
      title: t('legal.privacy.title'),
      sections: [
        {
          heading: t('legal.privacy.collection'),
          content: t('legal.privacy.collectionDesc'),
        },
        {
          heading: t('legal.privacy.usage'),
          content: t('legal.privacy.usageDesc'),
        },
        {
          heading: t('legal.privacy.security'),
          content: t('legal.privacy.securityDesc'),
        },
        {
          heading: t('legal.privacy.rights'),
          content: t('legal.privacy.rightsDesc'),
        },
      ],
    },
    terms: {
      title: t('legal.terms.title'),
      sections: [
        {
          heading: t('legal.terms.acceptance'),
          content: t('legal.terms.acceptanceDesc'),
        },
        {
          heading: t('legal.terms.license'),
          content: t('legal.terms.licenseDesc'),
        },
        {
          heading: t('legal.terms.restrictions'),
          content: t('legal.terms.restrictionsDesc'),
        },
        {
          heading: t('legal.terms.liability'),
          content: t('legal.terms.liabilityDesc'),
        },
      ],
    },
    cookies: {
      title: t('legal.cookies.title'),
      sections: [
        {
          heading: t('legal.cookies.what'),
          content: t('legal.cookies.whatDesc'),
        },
        {
          heading: t('legal.cookies.types'),
          content: t('legal.cookies.typesDesc'),
        },
        {
          heading: t('legal.cookies.manage'),
          content: t('legal.cookies.manageDesc'),
        },
      ],
    },
  };

  const currentContent = content[type as keyof typeof content] || content.privacy;

  return (
    <div className="min-h-screen bg-gray-50 py-8 particle-bg">
      <div className="max-w-4xl mx-auto px-4 tablet-padding">
        <Button
          variant="ghost"
          className="mb-6 hover-lift"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back')}
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-8 animate-fade-in glass-modern neon-border">
          <h1 className="text-4xl font-bold mb-2 text-gradient-animate responsive-heading">{currentContent.title}</h1>
          <p className="text-gray-500 mb-8">
            {t('legal.lastUpdated')}: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            {currentContent.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-2xl font-semibold mb-3">{section.heading}</h2>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t">
            <p className="text-sm text-gray-600">
              {t('legal.questions')}{' '}
              <a href="mailto:legal@budgettracker.com" className="text-primary hover:underline">
                legal@budgettracker.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
