from zope.interface import Interface


class IRenoPrime(Interface):
    """Marker interface for the Reno Prime Map"""


from zope.interface import implements

from Products.Archetypes import atapi
from Products.ATContentTypes.content import base
from Products.ATContentTypes.content import schemata
from Products.ATContentTypes.configuration import zconf

# -*- Message Factory Imported Here -*-
from cirb.renoprime import renoprimeMessageFactory as _

from cirb.renoprime import PROJECTNAME

RenoPrimeSchema = schemata.ATContentTypeSchema.copy() + atapi.Schema((

    # -*- Your Archetypes field definitions here ... -*-

    atapi.TextField('text_above_map',
              required=False,
              searchable=True,
              primary=True,
              storage=atapi.AnnotationStorage(migrate=True),
              validators=('isTidyHtmlWithCleanup',),
              #validators=('isTidyHtml',),
              default_output_type='text/x-html-safe',
              widget=atapi.RichWidget(
                        description='',
                        label=_(u'label_before_map', default=u'Text before map'),
                        rows=25,
                        allow_file_upload=zconf.ATDocument.allow_document_upload),
    ),

    atapi.TextField('text_below_map',
              required=False,
              searchable=True,
              storage=atapi.AnnotationStorage(migrate=True),
              validators=('isTidyHtmlWithCleanup',),
              #validators=('isTidyHtml',),
              default_output_type='text/x-html-safe',
              widget=atapi.RichWidget(
                        description='',
                        label=_(u'label_below_map', default=u'Text below map'),
                        rows=25,
                        allow_file_upload=zconf.ATDocument.allow_document_upload),
    ),



))


schemata.finalizeATCTSchema(RenoPrimeSchema, moveDiscussion=False)


class RenoPrime(base.ATCTContent):
    """A map construct with a ."""
    implements(IRenoPrime)

    meta_type = "RenoPrime"
    schema = RenoPrimeSchema


atapi.registerType(RenoPrime, PROJECTNAME)
