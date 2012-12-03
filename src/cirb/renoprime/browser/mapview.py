from zope.interface import implements, Interface

from Products.Five import BrowserView
from Products.CMFCore.utils import getToolByName

from datetime import datetime

from cirb.renoprime import renoprimeMessageFactory as _


class IMapView(Interface):
    """
    Map view interface
    """

    def test():
        """ test method"""


class MapView(BrowserView):
    """
    Map browser view
    """
    implements(IMapView)

    def __init__(self, context, request):
        self.context = context
        self.request = request

    @property
    def portal_catalog(self):
        return getToolByName(self.context, 'portal_catalog')

    @property
    def portal(self):
        return getToolByName(self.context, 'portal_url').getPortalObject()

    def test(self):
        """
        test method
        """
        dummy = _(u'a dummy string')

        return {'dummy': dummy}

    def get_today(self):
        today = datetime.now()
        return today.strftime('%Y-%m-%d')
