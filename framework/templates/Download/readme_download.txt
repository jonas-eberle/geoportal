Readme for {{ archive_name }}

--------
Download
--------
Source name:     GEO-Wetlands Community / SWOS portal
Source link:     http://portal.swos-service.eu
Date:            {{date}}

-------
Content
-------
{% for file in files %}
- {{ file }}
{% endfor %}

--------
Metadata
--------
Description:     {{layer.abstract}}

Lineage:         {{layer.meta_lineage}}

Temporal extent: {{layer.date_begin}} - {{layer.date_end}}
Category:        {% for topicCategory in layer.topicCategory %}{{topicCategory.identifier}}, {% endfor %}
Keywords:        {% for keyword in layer.layer_keywords %}{{ keyword.keyword }},{% endfor %}{% for keyword in keyword_list %}{{ keyword }},{% endfor %}
Resolution:      {% if layer.resolution_distance %}{{ layer.resolution_distance }} {{ layer.resolution_unit }} {% endif %}{% if layer.equi_scale %}{{ layer.equi_scale }}{% endif %}
{% if layer.date_creation %}Creation date:   {{layer.date_creation}}{% endif %}{% if layer.date_publication %}
Publication date:{{layer.date_publication}}{% endif %}{% if layer.date_revision %}
Revision date:   {{layer.date_revision}}{% endif %}

----------------
Point of contact
----------------
{% for meta_contact in layer.point_of_contacts %}{% if meta_contact.last_name %}Contact Person:       {{ meta_contact.first_name }} {{ meta_contact.last_name }}{% endif %}{% if meta_contact.email %}
Email:                {{ meta_contact.email }}{% endif %}{% if meta_contact.organisation %}
Contact Organisation: {{ meta_contact.organisation }} {% endif %}{% if meta_contact.position %}
Contact Position:     {{ meta_contact.position }} {% endif %}{% if meta_contact.telephone %}
Telephone:            {{ meta_contact.telephone }}{% endif %}{% if meta_contact.fax %}
Fax:                  {{ meta_contact.fax }}{%endif %}{% if meta_contact.address %}
Adress:               {{ meta_contact.address }}{% endif %}{% if meta_contact.city %}
City:                 {{ meta_contact.city }}{% endif %}{% if meta_contact.state %}
State:                {{ meta_contact.state }}{% endif %}{% if meta_contact.postcode %}
Postcode:             {{ meta_contact.postcode }}{% endif %}{% if meta_contact.country %}
Country:              {{ meta_contact.country }}{% endif %}
{% endfor %}




