from plone.app.testing import PloneSandboxLayer
from plone.app.testing import applyProfile
from plone.app.testing import PLONE_FIXTURE
from plone.app.testing import IntegrationTesting

from plone.testing import z2

from zope.configuration import xmlconfig


class CirbrenoprimeLayer(PloneSandboxLayer):

    defaultBases = (PLONE_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        # Load ZCML
        import cirb.renoprime
        xmlconfig.file('configure.zcml', cirb.renoprime, context=configurationContext)

        # Install products that use an old-style initialize() function
        z2.installProduct(app, 'collective.geo.openlayers')

#    def tearDownZope(self, app):
#        # Uninstall products installed above
#        z2.uninstallProduct(app, 'Products.PloneFormGen')

    def setUpPloneSite(self, portal):
        applyProfile(portal, 'cirb.renoprime:default')

CIRB_RENOPRIME_FIXTURE = CirbrenoprimeLayer()
CIRB_RENOPRIME_INTEGRATION_TESTING = IntegrationTesting(bases=(CIRB_RENOPRIME_FIXTURE,), name="CirbrenoprimeLayer:Integration")
